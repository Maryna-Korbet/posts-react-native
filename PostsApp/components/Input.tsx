import {
    TextInput,
    StyleSheet,
    View,
    ViewProps,
    Text
} from "react-native"
import React, {FC, useState} from "react";
import {colors} from "../styles/GlobalStyles";


type InputProps = {
    value: string,
    error?: string,
    placeholder?: string,
    outerStyles?: ViewProps['style'],
    rightButton?: React.ReactNode,
    secureTextEntry?: boolean,
    autofocus?: boolean,
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters',
    onValueChange: (value: string) => void,
}

const Input: FC<InputProps> = ({
    value,
    error,
    placeholder,
    outerStyles,
    rightButton,
    secureTextEntry = false,
    autofocus = false,
    autoCapitalize = 'none',
    onValueChange,
}) => {
    const [isFocused, setIsFocused] = useState(false);

    const onFocus = () => {
        setIsFocused(true);
    }

    const onBlur = () => {
        setIsFocused(false);
    }

    return (
        <View style={[styles.input, isFocused && styles.focused, outerStyles]}>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <TextInput
                style={styles.textInput}
                value={value}
                placeholder={placeholder}
                secureTextEntry={secureTextEntry}
                autoFocus={autofocus}
                autoCapitalize={autoCapitalize}
                onFocus={onFocus}
                onBlur={onBlur}
                onChangeText={onValueChange}
            />
            {rightButton}
        </View>
    )
};

const styles = StyleSheet.create({
    input: {
        padding: 16,
        height: 50,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: colors.border_color,
        backgroundColor: colors.text_gray,
    },
    textInput: {
        fontFamily: 'Roboto-Regular',
        fontSize: 16,
        fontWeight: "400",
        lineHeight: 18,
        color: colors.black,
    },
    errorText: {
        position: 'absolute',
        backgroundColor: colors.white,
        marginLeft: 16,
        marginTop: -12,
        color: colors.error,
    },
    focused: {
        borderColor: colors.orange,
        backgroundColor: colors.white,
    },
});

export default Input;