import React, {useState, useEffect} from 'react'
import {SafeAreaView, View, ScrollView, Image, Text, StyleSheet, TouchableOpacity, YellowBox} from 'react-native'
import {createSwitchNavigator, createAppContainer, Navigation} from 'react-navigation'
import AntDesign from 'react-native-vector-icons/AntDesign'
import {useSelector} from 'react-redux'
import {createStackNavigator} from 'react-navigation-stack'
import {createDrawerNavigator, DrawerItems} from 'react-navigation-drawer'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import Splash from './screen/Splash'
import Recordmp3 from './screen/Recordmp3'
import FreeRecording from './screen/FreeRecording'
import DefinedRecording from './screen/DefinedRecording'
import Settings from './screen/Settings'
import Drawer from './screen/Drawer'
import colors from './common/colors'

const ignoreWarnings = [
    // 'Warning: componentWillMount is deprecated',
    // 'Warning: componentWillReceiveProps is deprecated',
    // 'Module RCTImageLoader requires',
    'VirtualizedLists should never'

]

YellowBox.ignoreWarnings(ignoreWarnings)
// console.disableYellowBox = true
// console.warn = warn => {
//     for (const msg of ignoreWarnings) {
//         if (warn.indexOf(msg) != -1) {
//             return
//         } else {
//         }
//     }
//     console.warn(warn)
// }

const Recordmp3Stack = createStackNavigator({
    Recordmp3: {
        screen: Recordmp3,
        navigationOptions: ({navigation}) => ({
            title: 'Recorder App',
            headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 20
            },
            // headerLeft: ()=>(
            //     <FontAwesome
            //         style={{marginLeft: 10}}
            //         size={30}
            //         name="bars"
            //         color={colors.primary}
            //         onPress={() => navigation.openDrawer()}
            //     />
            // ),
            headerRight: () => (
                <AntDesign name="setting" color='black' size={25} style={{marginRight: 10}}
                    onPress={()=>navigation.push('Settings')}
                />
            ),
            // headerRightContainerStyle: {
            //     width: 50, height: 50
            // }
        })
    },
    Free: {
        screen: FreeRecording,
        navigationOptions: () => ({
            headerShown: false,
            title: 'Free Recording'
        })
    },
    Defined: {
        screen: DefinedRecording,
        navigationOptions: () => ({
            headerShown: false,
            title: 'Defined Recording'
        })
    },
})

const SettingsStack = createStackNavigator({
    Settings: {
        screen: Settings,
        navigationOptions: ({navigation}) => ({
            title: 'Settings',
            headerLeft: ()=>(
                <FontAwesome
                    style={{marginLeft: 10}}
                    size={30}
                    name="bars"
                    color={colors.primary}
                    onPress={() => navigation.openDrawer()}
                />
            ),
            // headerRight: () => (
            //     <Image source={require('../asset/databird.png')} style={{width: 30, height: 30}} resizeMode='center'/>
            // ),
            // headerRightContainerStyle: {
            //     width: 50, height: 50
            // }
        })
    },
})
const DrawerStack = createDrawerNavigator(
    {
        Recordmp3: {
            screen: Recordmp3Stack,
            navigationOptions: {
                drawerIcon: props => <AntDesign name="dashboard" color={colors.primary} focused={props.focused} size={25}/>
            }
        },
        Settings: {
            screen: SettingsStack,
            navigationOptions: {
                drawerIcon: props => <AntDesign name="setting" color={colors.primary} focused={props.focused} size={25}/>
            }
        }
    },
    {
        contentComponent: props => { return <Drawer {...props}/> },
        drawerBackgroundColor: 'white'
    }
)

// const AppContainer = createAppContainer(DrawerStack)
const AppContainer = createAppContainer(createStackNavigator(
    {
        RecordApp: {
            screen: Recordmp3Stack,
            navigationOptions: {
                headerShown: false
            }
        },
        Settings: {
            screen: Settings,
            navigationOptions: {
                headerTitleStyle: {
                    fontWeight: 'bold',
                    fontSize: 20
                }
            }
        }
    }
))

export default function App(props) {
    const [loading, setLoading] = useState(true)
    useEffect(()=>{
        setTimeout(()=>{
            setLoading(false)
        }, 2000)
    })   
    if (loading) {
        return <Splash/>
    }
    return <AppContainer/>
}