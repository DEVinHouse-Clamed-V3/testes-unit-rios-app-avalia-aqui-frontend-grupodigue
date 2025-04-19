import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import TelaPrincipal from './screens/TelaPrincipal'; // Ajuste o caminho conforme necessário
import ListaJogos from './screens/ListaJogos ';
import CadastrarFeedBack from './screens/CadastrarFeedBack';

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="Home" component={TelaPrincipal} />
        <Drawer.Screen name="ListGames" component={ListaJogos} />
        <Drawer.Screen name="CadastrarFeedBack" component={CadastrarFeedBack} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewCabecalho: {
    justifyContent: 'center',
    marginBottom: 10,
  },
  textCabecalho: {
    fontSize: 30,
    textAlign: 'justify',
    fontWeight: 'bold',
  },
  viewTextPrincipal: {
    width: '60%',
    alignItems: 'center',
  },
  TextPrincipal: {
    textAlign: 'center',
  },
});
