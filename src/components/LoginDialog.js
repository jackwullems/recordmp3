import {View, TextInput, Text} from 'react-native'
import {Overlay, Divider, Button, CheckBox} from 'react-native-elements'
import React, { useState, useEffect } from 'react'
import Toast from 'react-native-simple-toast'

export default ({visibleLogin, onLogin}) => {
    const [visible, setVisible] = useState(visibleLogin)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [remember, setRemember] = useState(false)
    useEffect(()=>{
        setVisible(visibleLogin)
    }, [visibleLogin])
    const handleLogin = () => {
        if (!username || !password) {
            Toast('Input user name and password!')
            return
        }
        onLogin(true, username, password, remember)
        return
    }
    const handleRemember = () => {
        setRemember(!remember)
    }
    return (
        <Overlay
            isVisible={visible}
            overlayStyle={{justifyContent: 'center'}}
        >
        <View style={{justifyContent: 'center'}}>
            <Text style={{fontWeight: 'bold', fontSize: 20}}>Need to log in</Text>
            <Divider style={{backgroundColor: 'grey'}}/>
            <TextInput
                autoCapitalize='none'
                autoCorrect={false}
                autoCompleteType='off'
                keyboardType='email-address'
                placeholder='User name'
                onChangeText={text=>setUsername(text)}
                value={username}
            />
            <Divider style={{backgroundColor: 'grey'}}/>
            <TextInput
                placeholder='Password'
                secureTextEntry={true}
                onChangeText={text=>setPassword(text)}
                value={password}
            />
            <Divider style={{backgroundColor: 'grey'}}/>
            <CheckBox
                title='remember login'
                checked={remember}
                onPress={handleRemember}
            />
            <View style={{flexDirection: 'row', marginTop: 20, marginBottom: 20, justifyContent: 'space-around'}}>
                <Button
                    title='CANCEL'
                    type='outline'
                    containerStyle={{width: 100, height: 30}}
                    titleStyle={{color: '#AAAAAA'}}
                    onPress={()=>onLogin(false)}
                />
                <Button
                    title='LOGIN'
                    containerStyle={{width: 100, height: 30}}
                    buttonStyle={{backgroundColor: colors.primary}}
                    onPress={handleLogin}
                />
            </View>
        </View>
    </Overlay>

    )
}