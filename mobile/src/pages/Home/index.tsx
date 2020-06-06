import React, { useState, useEffect } from 'react';
import { View, ImageBackground, Image, StyleSheet, Text, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';

//reacrtive-native-picker-select

interface Item {
  value: string,
  label: string
}

interface Uf {
  id: number,
  sigla: string,
  nome: string
}

interface City {
  id: number,
  nome: string
}

const Home = () => {

  const [uf, setUf] = useState('');
  const [city, setCity] = useState('');
  const [ufs, setUfs] = useState<Item[]>([]);
  const [cities, setCities] = useState<Item[]>([]);

  const navigation = useNavigation();

  function hadleNavigateToPoints() {
    navigation.navigate('Points', {
      city,
      uf
    });
  }

  useEffect(() => {
    axios.get("https://servicodados.ibge.gov.br/api/v1/localidades/estados").then(response => {
      const respData = response.data as Uf[];
      const items = new Array<Item>();
      respData.map(dt => items.push({
        value: dt.sigla,
        label: dt.nome
      }))
      setUfs(items);
    })
  }, []);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ImageBackground
        source={require('../../assets/home-background.png')}
        style={styles.container}
        imageStyle={{
          width: 274,
          height: 368
        }}
      >
        <View style={styles.main} >
          <Image source={require('../../assets/logo.png')} />
          <View>
            <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
            <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente</Text>
          </View>
        </View>

        <View style={styles.footer}>

          <RNPickerSelect
            style={{ ...pickerSelectStyles }}

            placeholder={{
              label: 'Selecione um estado...',
              value: null,
            }}

            items={ufs}

            onValueChange={value => {
              const uf = value;
              axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/distritos`).then(response => {
                const respData = response.data as City[];
                const items = new Array<Item>();
                respData.map(dt => items.push({
                  value: dt.nome,
                  label: dt.nome
                }))
                setCities(items);
              })
              setUf(uf);
            }}
          />

          <RNPickerSelect
            style={{ ...pickerSelectStyles }}

            placeholder={{
              label: 'Selecione uma Cidade...',
              value: null,
            }}

            items={cities ? cities : [{
              label: 'Selecione uma UF',
              value: '0'
            }]}

            onValueChange={value => {
              const city = value;
              setCity(city);
            }}


          />
          <RectButton style={styles.button} onPress={hadleNavigateToPoints}>
            <View style={styles.buttonIcon}>
              <Text>
                <Icon name="arrow-right" color="#FFF" size={24} />
              </Text>
            </View>
            <Text style={styles.buttonText}>
              Entrar
          </Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};


const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingTop: 13,
    paddingHorizontal: 10,
    paddingBottom: 12,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    backgroundColor: 'white',
    color: 'black',
  },
  inputAndroid: {
    fontSize: 25,
    paddingTop: 13,
    paddingHorizontal: 10,
    paddingBottom: 25,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    backgroundColor: 'white',
    color: 'black',
    marginBottom: 10
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  inputSelect: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

export default Home;