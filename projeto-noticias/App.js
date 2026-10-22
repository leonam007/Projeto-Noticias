import { useLayoutEffect } from 'react';
import { Button, FlatList, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, DrawerActions } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

const img = (n) => `https://picsum.photos/seed/${n}/600/400`;
const NOTICIAS = [
  { id: '1', categoria: 'tecnologia', titulo: 'Novos chips prometem mais autonomia', resumo: 'Processadores mais eficientes para celulares.', conteudo: 'Fabricantes apresentaram chips que reduzem o consumo de energia em até 30%, aumentando a autonomia em pcs da Xuxa.', imagem: img('chip') },
  { id: '2', categoria: 'tecnologia', titulo: 'IA ganha espaço nas escolas', resumo: 'Ferramentas apoiam professores e alunos.', conteudo: 'Escolas testam inteligência artificial no planejamento de aulas e no estudo individual, com orientação do professor Victor Vidigal.', imagem: img('ia') },
  { id: '3', categoria: 'esportes', titulo: 'Clássico termina empatado', resumo: 'Jogo movimentado terminou em 2 a 2.', conteudo: 'O gol de empate saiu nos acréscimos pelo jogador do Meia Boca Juniors contra o time do Flasco brigando pela lanterna do campeonato.', imagem: img('futebol') },
  { id: '4', categoria: 'esportes', titulo: 'Maratona reúne milhares de corredores', resumo: 'Percursos de 5, 10 e 252 km.', conteudo: 'A maratona da cidade duração de 3 dias e 12 min e 27 seg passando por 252km de estrada.', imagem: img('maratona') },
];

const CardNoticia = ({ noticia, onPress }) => (
  <Pressable style={s.card} onPress={onPress}>
    <Image source={{ uri: noticia.imagem }} style={s.cardImg} />
    <View style={{ padding: 12 }}>
      <Text style={s.cardTitulo}>{noticia.titulo}</Text>
      <Text style={{ color: '#555' }}>{noticia.resumo}</Text>
    </View>
  </Pressable>
);

const Lista = ({ navigation, route }) => (
  <FlatList
    style={{ backgroundColor: 'white' }}
    contentContainerStyle={{ padding: 16 }}
    data={NOTICIAS.filter((n) => n.categoria === route.params.categoria)}
    keyExtractor={(n) => n.id}
    renderItem={({ item }) => (
      <CardNoticia noticia={item} onPress={() => navigation.navigate('Leitura', { noticia: item })} />
    )}
  />
);

const Detalhes = ({ navigation, route }) => {
  const { noticia } = route.params;
  useLayoutEffect(() => navigation.setOptions({ title: noticia.titulo }), []);
  return (
    <ScrollView>
      <Image source={{ uri: noticia.imagem }} style={{ height: 220 }} />
      <Text style={s.titulo}>{noticia.titulo}</Text>
      <Text style={s.texto}>{noticia.conteudo}</Text>
    </ScrollView>
  );
};

const Sobre = ({ navigation }) => (
  <View style={{ flex: 1, padding: 24, alignItems: 'center' }}>
    <Image source={require('./assets/foto.png')} style={{ width: '90%', height: 300, borderRadius: 12 }} />
    <Text style={s.titulo}>Criador</Text>
    <Text style={s.texto}>Essa aplicação foi criada por este distinto rapaz.</Text>
    <Button title="Voltar" onPress={() => navigation.navigate('Noticias')} />
  </View>
);

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const criarStack = (categoria, titulo) => () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Lista"
      component={Lista}
      initialParams={{ categoria }}
      options={({ navigation }) => ({
        title: titulo,
        headerLeft: () => (
          <Pressable onPress={() => navigation.dispatch(DrawerActions.openDrawer())} style={{ marginRight: 16 }}>
            <Ionicons name="menu" size={26} />
          </Pressable>
        ),
      })}
    />
    <Stack.Screen
      name="Leitura"
      component={Detalhes}
      options={({ navigation }) => ({
        headerLeft: () => <Button title="Voltar" onPress={() => navigation.goBack()} />,
      })}
    />
  </Stack.Navigator>
);
const StackTecnologia = criarStack('tecnologia', 'Mundo Tech');
const StackEsportes = criarStack('esportes', 'Mundo Esportivo');

const Tabs = () => (
  <Tab.Navigator screenOptions={{ headerShown: false }}>
    <Tab.Screen name="Inovação" component={StackTecnologia}
      options={{ tabBarIcon: (p) => <Ionicons name="hardware-chip-outline" {...p} /> }} />
    <Tab.Screen name="Placar" component={StackEsportes}
      options={{ tabBarIcon: (p) => <Ionicons name="football-outline" {...p} /> }} />
  </Tab.Navigator>
);

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="Noticias" component={Tabs}
          options={{ title: 'Notícias', headerShown: false, drawerIcon: (p) => <Ionicons name="newspaper-outline" {...p} /> }} />
        <Drawer.Screen name="Sobre" component={Sobre}
          options={{ drawerIcon: (p) => <Ionicons name="information-circle-outline" {...p} /> }} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const s = StyleSheet.create({
  card: { backgroundColor: 'white', borderRadius: 22, marginBottom: 14, overflow: 'hidden', elevation: 2 },
  cardImg: { height: 150 },
  cardTitulo: { fontSize: 17, fontWeight: 'bold', marginBottom: 4 },
  titulo: { fontSize: 22, fontWeight: 'bold', margin: 16 },
  texto: { fontSize: 16, lineHeight: 24, marginHorizontal: 16, marginBottom: 16 },
});