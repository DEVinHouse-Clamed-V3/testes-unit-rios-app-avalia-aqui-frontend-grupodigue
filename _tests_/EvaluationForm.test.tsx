
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CadastrarFeedBack from '../src/CadastrarFeedBack'; // ajuste o caminho se necessário
import axios from 'axios';
import { Alert } from 'react-native';

// Mock de axios para simular chamadas HTTP
jest.mock('axios');

// Mock da função de navegação
const mockNavigate = jest.fn();
const mockNavigation = { navigate: mockNavigate };

describe('CadastrarFeedBack', () => {
  beforeEach(() => {
    // Limpa os mocks antes de cada teste para evitar interferências
    jest.clearAllMocks();
  });

  it('deve renderizar todos os campos do formulário', () => {
    const { getByPlaceholderText, getByText } = render(
      <CadastrarFeedBack navigation={mockNavigation} route={{ params: { productId: 1 } }} />
    );

    // Verifica se os inputs e botão de envio estão na tela
    expect(getByPlaceholderText('Seu nome')).toBeTruthy();
    expect(getByPlaceholderText('Seu email')).toBeTruthy();
    expect(getByPlaceholderText('Descreva a sua experiencia')).toBeTruthy();
    expect(getByText('Enviar relatório')).toBeTruthy();
  });

  it('deve mostrar um alerta se tentar enviar sem preencher os campos obrigatórios', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert');

    const { getByText } = render(
      <CadastrarFeedBack navigation={mockNavigation} route={{ params: { productId: 1 } }} />
    );

    // Simula o clique no botão sem preencher campos
    fireEvent.press(getByText('Enviar relatório'));

    // Espera que o alerta tenha sido disparado com a mensagem correta
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Aviso', 'Todos os campos são obrigatórios.');
    });
  });

  it('deve mostrar um alerta se o email informado for inválido', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert');

    const { getByPlaceholderText, getByText } = render(
      <CadastrarFeedBack navigation={mockNavigation} route={{ params: { productId: 1 } }} />
    );

    // Preenche os campos com um email inválido
    fireEvent.changeText(getByPlaceholderText('Seu nome'), 'Teste');
    fireEvent.changeText(getByPlaceholderText('Seu email'), 'emailinvalido');
    fireEvent.changeText(getByPlaceholderText('Descreva a sua experiencia'), 'Ótimo produto');

    // Tenta enviar o formulário
    fireEvent.press(getByText('Enviar relatório'));

    // Espera que o alerta tenha sido disparado informando email inválido
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Aviso', 'Digite um e-mail válido.');
    });
  });

  it('deve enviar o formulário corretamente com dados válidos', async () => {
    // Simula o sucesso da chamada POST
    (axios.post as jest.Mock).mockResolvedValueOnce({});

    const alertSpy = jest.spyOn(Alert, 'alert');

    const { getByPlaceholderText, getByText } = render(
      <CadastrarFeedBack navigation={mockNavigation} route={{ params: { productId: 1 } }} />
    );

    // Preenche todos os campos com dados válidos
    fireEvent.changeText(getByPlaceholderText('Seu nome'), 'Teste');
    fireEvent.changeText(getByPlaceholderText('Seu email'), 'teste@email.com');
    fireEvent.changeText(getByPlaceholderText('Descreva a sua experiencia'), 'Ótimo produto');

    // Seleciona a opção de experiência
    fireEvent.press(getByText('TOP'));

    // Tenta enviar o formulário
    fireEvent.press(getByText('Enviar relatório'));

    // Espera que o axios.post tenha sido chamado e o alerta de sucesso exibido
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
      expect(alertSpy).toHaveBeenCalledWith('Sucesso', 'Feedback enviado com sucesso!');
    });
  });

  it('deve navegar para a tela de ListGames ao clicar em "Voltar"', () => {
    const { getByText } = render(
      <CadastrarFeedBack navigation={mockNavigation} route={{ params: { productId: 1 } }} />
    );

    // Simula o clique no botão "Voltar"
    fireEvent.press(getByText('Voltar'));

    // Verifica se a navegação para "ListGames" foi chamada
    expect(mockNavigate).toHaveBeenCalledWith('ListGames');
  });
});
