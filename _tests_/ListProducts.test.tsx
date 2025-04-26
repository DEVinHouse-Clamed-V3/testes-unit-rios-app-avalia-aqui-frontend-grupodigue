// tests/ListProducts.test.ts

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ListaJogos from '../screens/ListaJogos';
import { NavigationContainer } from '@react-navigation/native';
import axios from 'axios';

// Mocka o axios para controlar manualmente as respostas das requisições
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock do LottieView para evitar erro com animação nos testes
jest.mock('lottie-react-native', () => 'LottieView');

describe('Tela de Listagem de Produtos (Jogos)', () => {
  // Mock da função de navegação
  const mockNavigate = jest.fn();

  // Simula a resposta da API antes de cada teste
  beforeEach(() => {
    mockedAxios.get.mockResolvedValue({
      data: [
        {
          id: 1,
          name: 'The Witcher 3',
          brand: 'CD Projekt',
          console: 'PS4',
          description: 'RPG de mundo aberto',
          image: 'https://exemplo.com/witcher3.jpg',
        },
        {
          id: 2,
          name: 'Cyberpunk 2077',
          brand: 'CD Projekt',
          console: 'PS5',
          description: 'RPG futurista',
          image: 'https://exemplo.com/cyberpunk2077.jpg',
        },
      ],
    });
  });

  // Função para renderizar o componente com NavigationContainer
  const renderListaJogos = () => {
    return render(
      <NavigationContainer>
        <ListaJogos navigation={{ navigate: mockNavigate }} />
      </NavigationContainer>
    );
  };

  it('deve renderizar a lista de jogos corretamente', async () => {
    const { getByText } = renderListaJogos();

    // Aguarda os jogos serem carregados e exibidos
    await waitFor(() => {
      expect(getByText('The Witcher 3')).toBeTruthy();
      expect(getByText('Cyberpunk 2077')).toBeTruthy();
    });
  });

  it('deve filtrar os jogos pela pesquisa', async () => {
    const { getByPlaceholderText, getByText, queryByText } = renderListaJogos();

    const inputBusca = getByPlaceholderText('Pesquisar');

    // Aguarda renderizar os jogos
    await waitFor(() => {
      expect(getByText('The Witcher 3')).toBeTruthy();
      expect(getByText('Cyberpunk 2077')).toBeTruthy();
    });

    // Digita "witcher" na busca
    fireEvent.changeText(inputBusca, 'witcher');

    // Espera o filtro aplicar
    await waitFor(() => {
      expect(getByText('The Witcher 3')).toBeTruthy();
      expect(queryByText('Cyberpunk 2077')).toBeNull();
    });
  });

  it('deve navegar para a tela de cadastro de feedback ao clicar no botão', async () => {
    const { getByText } = renderListaJogos();

    // Espera os jogos carregarem
    await waitFor(() => {
      expect(getByText('The Witcher 3')).toBeTruthy();
    });

    // Clica no botão "Clique Aqui" (considerando que cada card tem apenas um botão)
    const botao = getByText('Clique Aqui');
    fireEvent.press(botao);

    // Verifica se o navigate foi chamado
    expect(mockNavigate).toHaveBeenCalled();
  });

  it('deve exibir imagem de lista vazia quando não houver produtos', async () => {
    // Força a API a retornar lista vazia
    mockedAxios.get.mockResolvedValueOnce({ data: [] });

    const { getByTestId } = renderListaJogos();

    // Aguarda carregar a FlatList vazia
    await waitFor(() => {
      expect(getByTestId('lista-vazia')).toBeTruthy();
    });
  });
});
