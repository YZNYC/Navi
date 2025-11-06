//Importando bibliotecas
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

//Provider
import { LoginProvider, useLogin } from "./src/providers/loginProvider.js";

//Importando as rotas
import { LoginForm } from "./src/app/account/loginForm.js";
import Account from "./src/app/account/account.js";
import Main from "./src/app/main/main.js";
import History from "./src/app/history/history.js";
import Settings from "./src/app/settings/settings.js";
import Help from "./src/app/help/help.js";

//Importando o Navegador
const Stack = createStackNavigator();

function AppNavigator() {
  const { user } = useLogin();

  return (
    <Stack.Navigator>
      {user ? (
        <>
          <Stack.Screen name="Página inicial" component={Main} />
          <Stack.Screen name="Conta" component={Account} />
          <Stack.Screen name="Histórico" component={History} />
          <Stack.Screen name="Ajustes" component={Settings} />
          <Stack.Screen name="Ajuda" component={Help} />

        </>
      ) : (
        <Stack.Screen name="Login" component={LoginForm} />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <>
      <LoginProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </LoginProvider>
    </>
  );
}
