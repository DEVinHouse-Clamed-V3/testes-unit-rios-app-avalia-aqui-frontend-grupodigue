import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState, useMemo } from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native';

type ProspsList = {
  id: number;
  name: string;
  brand: string;
  console: string;
  description: string;
  image: string;
};
import { NavigationProp } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { globalStyles } from '../global/StylesGlobal';

export default function ListaJogos({
  navigation,
}: {
  navigation: NavigationProp<any>;
}) {
  const [jogosOriginais, setJogosOriginais] = useState<ProspsList[]>([]); // Lista original de jogos
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  // useMemo para filtrar jogos apenas quando a pesquisa mudar
  const jogosFiltrados = useMemo(() => {
    if (search !== '') {
      return jogosOriginais.filter(
        jogo =>
          jogo.name && jogo.name.toLowerCase().includes(search.toLowerCase()) // Busca case insensitive
      );
    } else {
      return jogosOriginais; // Mostrar todos os jogos se a pesquisa estiver vazia
    }
  }, [search, jogosOriginais]);

  function navigationCadastro({ produtoId }: { produtoId: number }) {
    navigation.navigate('CadastrarFeedBack', { productId: produtoId }); // Altere para corresponder ao nome da tela
  }

  // Carrega a lista de jogos da API ao montar o componente
  useEffect(() => {
    setLoading(true);
    axios
      .get(process.env.EXPO_PUBLIC_API_URL + '/games')
      .then(response => {
        setTimeout(() => {
          setLoading(false);
          setJogosOriginais(response.data); // Carregar a lista original de jogos
        }, 3000);
      })
      .catch(() => {
        setLoading(false);
        Alert.alert('Houve um erro na listagem de jogos');
      });
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor="#f3c715" />
      <View style={styles.container}>
        <View style={styles.ViewTile}>
          <Text style={styles.titleCabecalho}>Lista de jogos</Text>
          <TextInput
            testID="input-busca"
            style={globalStyles.textInput}
            placeholder="Pesquisar"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <View style={styles.ViewFlatList}>
          {loading ? (
            <LottieView
              autoPlay
              style={{ width: 300, height: 250 }}
              source={require('../assets/Animation - 1728223937271.json')}
            />
          ) : (
            <FlatList
              data={jogosFiltrados} // Exibir a lista filtrada
              keyExtractor={item => item.id.toString()}
              ListEmptyComponent={() => (
                <View testID="lista-vazia" style={styles.ViewImageEmpty}>
                  <Image
                    source={{
                      uri: 'https://cdn-icons-png.freepik.com/256/11329/11329073.png?semt=ais_hybrid',
                    }}
                    style={styles.ImageEmpty}
                  />
                </View>
              )}
              renderItem={({ item }) => (
                <View
                  key={item.id}
                  style={styles.Viewcontainer}
                  testID={`card-jogo-${item.id}`}
                >
                  <Image source={{ uri: item.image }} style={styles.imagem} />
                  <View style={styles.ViewTexts}>
                    <Text
                      testID={`nome-jogo-${item.id}`}
                      style={styles.TextTitle}
                    >
                      {item.name}
                    </Text>
                    <Text style={styles.Text}>{item.brand}</Text>
                    <Text style={styles.Text}>{item.console}</Text>
                    <Text style={styles.Text}>{item.description}</Text>
                    <TouchableOpacity
                      style={globalStyles.stylishButton}
                      onPress={() => navigationCadastro({ produtoId: item.id })}
                    >
                      <Text style={styles.buttonText}>Clique Aqui</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#003791',
  },
  ViewTile: {
    marginTop: 10,
    gap: 10,
  },
  titleCabecalho: {
    textAlign: 'center',
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  Viewcontainer: {
    flex: 1,
    alignItems: 'center',
    gap: 20,
    margin: 5,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: '#0a47a8',
  },
  ViewFlatList: { flex: 1 },

  ViewTexts: {
    gap: 10,
    margin: 20,
  },
  TextTitle: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 15,
  },
  Text: {
    color: 'white',
  },
  imagem: {
    marginTop: 10,
    width: 250,
    height: 400,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  TextEmpty: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 20,
  },
  ImageEmpty: {
    width: 200,
    height: 200,
  },
  ViewImageEmpty: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
