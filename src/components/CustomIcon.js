import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {StyleSheet} from 'react-native';

const CustomIcon = ({size = 22, name = 'home', color = '#fff', style = {}}) => {
  return (
    <Ionicons
      size={size}
      name={name}
      color={color}
      style={{...styles.icon, ...style}}
    />
  );
};

const styles = StyleSheet.create({
  icon: {
    margin: 5,
  },
});
export default CustomIcon;
