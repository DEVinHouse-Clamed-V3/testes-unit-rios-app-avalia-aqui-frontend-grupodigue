// Importa bibliotecas principais
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ListaJogos from '../screens/ListaJogos';
import axios from 'axios';
import { NavigationContainer } from '@react-navigation/native';

// Mock do axios para simular requisições HTTP sem bater na API real
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock do LottieView para evitar erro no teste (animações não funcionam bem em ambiente de teste)
jest.mock('lottie-react-native', () => 'LottieView');

describe('Tela de Lista de Jogos', () => {
  // Cria um mock da função navigate, usada para simular a navegação entre telas
  const mockNavigate = jest.fn();

  // Executa antes de cada teste
  beforeEach(() => {
    // Simula a resposta do axios.get retornando dois jogos
    mockedAxios.get.mockResolvedValue({
      data: [
        {
          id: 1,
          name: 'God of War',
          brand: 'Santa Monica',
          console: 'PS4',
          description: 'Aventura épica',
          image: 'https://exemplo.com/gow.jpg',
        },
        {
          id: 2,
          name: 'The Last of Us',
          brand: 'Naughty Dog',
          console: 'PS4',
          description: 'Pós-apocalíptico',
          image: 'https://exemplo.com/tlou.jpg',
        },
      ],
    });
  });

  // Função para renderizar o componente já dentro de NavigationContainer
  function renderListaJogos() {
    return render(
      <NavigationContainer>
        <ListaJogos navigation={{ navigate: mockNavigate }} />
      </NavigationContainer>
    );
  }

  // Teste 1: Verifica se os jogos são exibidos após o carregamento
  it('deve exibir os jogos após o carregamento', async () => {
    const { getByText } = renderListaJogos();

    // Espera até que os jogos sejam exibidos na tela
    await waitFor(() => {
      expect(getByText('God of War')).toBeTruthy();
      expect(getByText('The Last of Us')).toBeTruthy();
    });
  });

  // Teste 2: Verifica se a pesquisa filtra corretamente os jogos
  it('deve filtrar os jogos com base na pesquisa', async () => {
    const { getByPlaceholderText, getByText, queryByText } = renderListaJogos();

    const input = getByPlaceholderText('Pesquisar');

    // Aguarda os jogos aparecerem
    await waitFor(() => {
      expect(getByText('God of War')).toBeTruthy();
      expect(getByText('The Last of Us')).toBeTruthy();
    });

    // Simula o usuário digitando 'last' na barra de pesquisa
    fireEvent.changeText(input, 'last');

    // Após filtrar, "God of War" deve desaparecer e "The Last of Us" deve continuar
    await waitFor(() => {
      expect(queryByText('God of War')).toBeNull();
      expect(getByText('The Last of Us')).toBeTruthy();
    });
  });

  // Teste 3: Verifica se ao clicar em um jogo, a navegação é disparada
  it('deve navegar para detalhes ao clicar em um jogo', async () => {
    const { getByText } = renderListaJogos();

    // Aguarda o carregamento dos jogos
    await waitFor(() => {
      expect(getByText('God of War')).toBeTruthy();
    });

    // Simula o clique no jogo "God of War"
    const jogo = getByText('God of War');
    fireEvent.press(jogo);

    // Verifica se a função navigate foi chamada
    expect(mockNavigate).toHaveBeenCalled();
  });
});
