import React, { useContext } from 'react'
import { ScrollView, SafeAreaView, View, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { DrawerItems } from 'react-navigation-drawer'
import { useDispatch, useSelector } from 'react-redux'
import { NavigationContext } from 'react-navigation'
import { Block, Text } from 'galio-framework'
import Ionicons from 'react-native-vector-icons/Ionicons'
import RNExitApp from 'react-native-exit-app'

import colors from '../common/colors'

export default function Drawer(props) {
    const dispatch = useDispatch()
    const navigation = useContext(NavigationContext)
    const handleQuit = () => {
        navigation.closeDrawer()
        setTimeout(()=>{
            RNExitApp.exitApp()
        }, 1000)
    }
    return (
        <SafeAreaView style={styles.drawer} forceInset={{ top: 'always', horizontal: 'never' }}>
            <Block space="between" row style={styles.header}>
                <Block flex={0.3}><Image source={require('../../asset/recordmp3.png')} style={styles.avatar} /></Block>
            </Block>
            <ScrollView>
                <DrawerItems {...props} />
                <TouchableOpacity style={{flexDirection: 'row', marginLeft: 20, alignItems: 'center'}}
                    onPress={handleQuit}>
                    <Ionicons name='md-exit' color={colors.primary} size={30}/>
                    <Text style={{fontWeight: 'bold', marginLeft: 30}}>Quit</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>

    )
}

const styles = StyleSheet.create({
    logoutText: {
        fontWeight: 'bold',
        margin: 15
    },
    drawer: {
        flex: 1,
    },
    logoutDrawerItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    header: {
        paddingHorizontal: 10,
        paddingTop: 20,
        paddingBottom: 10,
        borderBottomColor: '#D8D8D8',
        borderBottomWidth: 0.5,
        marginTop: Platform.OS === 'android' ? 20 : null,
    },
    avatar: {
        width: 50,
        height: 50,
    },
    middle: {
        justifyContent: 'center',
    },
})