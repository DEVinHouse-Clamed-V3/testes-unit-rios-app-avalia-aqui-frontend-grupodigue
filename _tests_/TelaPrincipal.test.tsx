import { render, fireEvent, waitFor } from '@testing-library/react-native';
import TelaPrincipal from '../screens/TelaPrincipal';

describe('Testando rota de lista de jogos', () => {
  it('deve navegar para ListGames ao clicar no botão', async () => {
    const mockNavigate = jest.fn();

    const { getByText } = render(
      <TelaPrincipal navigation={{ navigate: mockNavigate } as any} />
    );

    // Aguardar até que o estado de "loading" seja alterado
    // Esperar que a animação termine e o botão apareça
    await waitFor(() => getByText('Clique Aqui'), { timeout: 3000 }); // Timeout aumentado para 3000ms

    // Agora que o botão apareceu, podemos clicar nele
    const botao = getByText('Clique Aqui');
    fireEvent.press(botao);

    // Verificar se a navegação foi chamada com o nome correto
    expect(mockNavigate).toHaveBeenCalledWith('ListGames');
  });
});
