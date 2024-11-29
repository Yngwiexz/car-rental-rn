import { Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'

export default function Button({
    title, 
    children, 
    onPress, 
    color,
    textColor = "#ffffff", 
    style
}) {
  return (
    <TouchableOpacity
        onPress={onPress}
        style={{
            backgroundColor: color,
            ...styles.button,
            ...style
        }}>
            { children ? children : 
            <Text style={{...styles.buttonTitle, color: textColor}}>{title}</Text> }
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    button: {
        padding: 10,
        alignItems:'center',
        borderRadius: 3,
    },
    buttonTitle: {
        textAlign: 'center',
        color: "#fff"
    }
})
