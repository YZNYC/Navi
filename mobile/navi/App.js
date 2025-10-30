//Importando bibliotecas
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

//Importando as rotas
import Account from "./src/app/account/account.js";
import Main from "./src/app/main/main.js";
import History from "./src/app/history/history.js";
import Settings from "./src/app/settings/settings.js";
import Help from "./src/app/help/help.js";

//importando o login
import { LoginForm } from "./src/app/account/account.js";

//Importando o Navegador
const Stack = createStackNavigator();

export default function App() {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginForm} />
          <Stack.Screen name="Página inicial" component={Main} />
          <Stack.Screen name="Conta" component={Account} />
          <Stack.Screen name="Histórico" component={History} />
          <Stack.Screen name="Ajustes" component={Settings} />
          <Stack.Screen name="Ajuda" component={Help} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
