import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
  textInput: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    fontSize: 16,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  stylishButton: {
    marginTop: 30,
    backgroundColor: '#2f66df', // Cor de fundo do botão
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30, // Arredondamento das bordas
    shadowColor: '#000', // Cor da sombra
    shadowOffset: { width: 0, height: 2 }, // Posição da sombra
    shadowOpacity: 0.8, // Opacidade da sombra
    shadowRadius: 8, // Distância da sombra
    elevation: 5, // Para funcionar no Android
  },
});
