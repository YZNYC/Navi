import { createStackNavigator } from "@react-navigation/stack";

// Importando as rotas
import { LoginForm } from "./src/app/account/index.js";
import { ForgotPassword } from "./src/app/account/forgot-password/forgot-password.js";
import Account from "./src/app/account/account.js";

import Main from "./src/app/main/main.js";
import History from "./src/app/history/history.js";
import Settings from "./src/app/settings/settings.js";
import Help from "./src/app/help/help.js";
import { Register } from "./src/app/account/register/register.js";

import { useLogin } from "./src/providers/loginProvider.js";

// Importando o Navegador
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
                <>
                    <Stack.Screen name="Login" component={LoginForm} />
                    <Stack.Screen name="Esqueci a senha" component={ForgotPassword} />
                    <Stack.Screen name="Cadastre-se" component={Register} />
                </>
            )}
        </Stack.Navigator>
    );
}

export default AppNavigator;
