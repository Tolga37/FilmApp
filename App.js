import React from 'react';
import {Provider} from 'react-redux';
import store from './src/redux/store';

import Movies from './src/screens/Movies';
import MoviesDetail from './src/screens/MoviesDetail';
import {StatusBar, Image} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';

const App = () => {
  const Stack = createStackNavigator();

  const headerOptions = {
    headerStyle: {backgroundColor: '#161620'},
    headerBackTitleVisible: false,
    headerTintColor: 'white',
    headerTitle: '',
  };

  return (
    <Provider store={store}>
      <NavigationContainer>
        <StatusBar barStyle="light-content" />
        <Stack.Navigator initialRouteName="Movies">
          <Stack.Screen
            name="Movies"
            component={Movies}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="MoviesDetail"
            component={MoviesDetail}
            options={headerOptions}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
