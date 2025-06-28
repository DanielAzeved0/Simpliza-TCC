import React, { useState, useEffect } from 'react';
import { View, TextInput, Animated, StyleSheet, Easing } from 'react-native';

export default function AnimatedInput({ label, value, onChangeText }) {
    const [isFocused, setIsFocused] = useState(false);
    const animatedIsFocused = useState(new Animated.Value(value === '' ? 0 : 1))[0];

    useEffect(() => {
        Animated.timing(animatedIsFocused, {
            toValue: (isFocused || value !== '') ? 1 : 0,
            duration: 400,
            easing: Easing.out(Easing.ease), 
            useNativeDriver: false,
        }).start();
    }, [isFocused, value]);

    const labelStyle = {
        position: 'absolute',
        left: 10,
        top: animatedIsFocused.interpolate({
            inputRange: [0, 1],
            outputRange: [14, -26],
        }),
        fontSize: animatedIsFocused.interpolate({
            inputRange: [0, 1],
            outputRange: [16, 18],
        }),
        color: animatedIsFocused.interpolate({
            inputRange: [0, 0],
            outputRange: ['rgba(255, 255, 255, 0.7)', '#000000'],
        }),
        backgroundColor: '#fef2f2',
        paddingHorizontal: 4,
    };

    return (
        <View style={styles.inputBox}>
            <Animated.Text style={labelStyle}>
                {label}
            </Animated.Text>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                style={[styles.input, (isFocused || value !== '') && { borderWidth: 2.3 }]}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                keyboardType={label === 'Valor' ? 'numeric' : 'default'}
                placeholder={isFocused ? '' : label}
                placeholderTextColor="#000"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    inputBox: {
        position: 'relative',
        width: '90%',
        marginBottom: 40,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: 'rgba(223, 77, 77, 0.7)',
        borderRadius: 5,
        paddingHorizontal: 10,
        color: '#000',
        backgroundColor: '#ffffff',
        fontSize: 16,
    },
});
