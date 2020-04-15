import React, {useState, useEffect, useRef, useContext} from 'react'
import {SafeAreaView,
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    Text,
    TextInput,
    PermissionsAndroid,
    Platform,
    ImageBackground
} from 'react-native'
import { Col, Row, Grid } from "react-native-easy-grid"
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import LinearGradient from 'react-native-linear-gradient'
import RNPickerSelect from 'react-native-picker-select'
import Entypo from 'react-native-vector-icons/Entypo'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import SoundRecorder from 'react-native-sound-recorder'
import {AudioRecorder, AudioUtils} from 'react-native-audio'
import RNFetchBlob from 'rn-fetch-blob'
import {useSelector, useDispatch} from 'react-redux'
import Spinner from "react-native-loading-spinner-overlay"
import {NavigationContext} from 'react-navigation'
import Toast from 'react-native-simple-toast'
import { transcode } from 'react-native-audio-transcoder'
import RNFS from 'react-native-fs'
import {Button} from 'react-native-elements'

import colors from '../common/colors'
import styles from '../common/styles'
import {saveFile} from '../redux/action'
import {SERVER_ADDRESS, GET_SPEAKERS} from '../common/constant'

export default FreeRecording = props => {
    const navigation = useContext(NavigationContext)
    const subject = navigation.getParam('subject', '')
    const [recording, setRecording] = useState(null)
    const [random, setRandom] = useState(1)
    const [duration, setDuration] = useState(0)
    const settings = useSelector(state=>state.settings)
    const filePath = useRef()
    const [spining, setSpining] = useState(false)
    const [speaker, setSpeaker] = useState(null)
    const dispatch = useDispatch()
    const [description, setDescription] = useState('')
    const [exit, setExit] = useState(false)
    const [speakers, setSpeakers] = useState([])

    const getSpeakers = () => {
        setSpining(true)
        fetch(SERVER_ADDRESS+GET_SPEAKERS)
        .then(response=>response.json())
        .then(results=>{
            setSpining(false)
            const speakers = []
            for (var index=0;index<results.length;index++) {
                const result = results[index]
                speakers.push({
                    label: result.name,
                    value: index,
                    id: result.id,
                    description: result.description
                })
            }
            setSpeakers(speakers)
        })
    }
    useEffect(()=>{
        getSpeakers()
        return () => {
            setExit(true)
        }
    },[])
    useEffect(()=>{
        // console.log(exit, recording)
        if (recording) {
            AudioRecorder.onProgress = handleProgress
        } else {
            AudioRecorder.onProgress = null
        }
        return async ()=>{
            // console.log('exit, recording:', exit, recording)
            if (exit && recording) {
                await AudioRecorder.stopRecording()
            }
        }
    }, [exit, recording])
    const handlePause = () => {
        if (recording == false) {
            AudioRecorder.resumeRecording().then(()=>{
                // console.log('resumeRecording')
                setRecording(!recording)
            }).catch(error=>{
                // console.log('resumeRecording:', error.message)
            })
        } else if (recording == true) {
            AudioRecorder.pauseRecording().then(()=>{
                // console.log('pauseRecording')
                setRecording(!recording)
            }).catch(error=>{
                // console.log('pauseRecording:', error.message)
            })
        }
    }
    const handleProgress = data => {
        // console.log(data)
        setDuration(Math.floor(data.currentTime*1000))
        // setRandom(1-Math.log(100)/Math.log(data.currentMetering+100))
        setRandom((data.currentMetering+160)/160)
    }
    const start = () => {
        RNFS.mkdir(settings.storage).then(()=>{
            filePath.current = settings.storage + `/${Date.now()}.aac`
            AudioRecorder.prepareRecordingAtPath(filePath.current, {
                SampleRate: settings.bitrate*1000,
                Channels: 1,
                AudioQuality: "Low",
                AudioEncoding: "aac",
                currentMetering: true
            }).then(()=>{
                setDuration(0)
                setSpining(true)
                AudioRecorder.onProgress = handleProgress
                AudioRecorder.startRecording().then(()=>{
                    // console.log('start recording....')
                    setSpining(false)
                    setRecording(true)
                })
            })
        })
    }
    const handleStart = () => {
        if (recording == null) {
            PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO).then(granted=>{
                if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                    Toast.show('You have to accept permission to record audio.')
                    return
                }
                if (Platform.OS == 'android') {
                    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE).then(granted=>{
                        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                            Toast.show('You have to accept permission to write audio file.')
                            return
                        }
                        start()
                    })
                    return
                }
                start()
            })
        }
    }
    const handleStop = () => {
        if (recording) {
            setSpining(true)
            AudioRecorder.stopRecording().then(()=>{
                setRandom(1)
                setRecording(null)
                setSpining(false)
            })
        }
    }
    const minutes = Math.floor(duration/60000)
    const secs = Math.floor((duration%60000)/1000)
    const handleSpeaker = speaker => {
        setSpeaker(speaker)
        setDescription(speakers[speaker].description)
    }
    const handleSave = () => {
        if (speaker == null) {
            Toast.show('Select speaker!')
            return
        }
        if (recording == null && filePath.current) {
            const myFilePath = filePath.current
            const myNewFile = myFilePath.replace('aac', 'mp3')
            setSpining(true)
            transcode(myFilePath, myNewFile).then(() => {
                RNFS.unlink(myFilePath)
                dispatch(saveFile({
                    type: 'free',
                    path: myNewFile,
                    duration,
                    subject,
                    description,
                    speaker: speakers[speaker]
                }))
                navigation.pop()
            }).catch(error=>{
                setSpining(false)
                console.log(error.message)
                Toast.show(error.message)
            })
        }
    }
    const handleDescription = description => {
        setDescription(description)
    }
    const handleCancel = () => {
        navigation.pop()
    }
    return (
        <SafeAreaView style={{flex: 1}}>
            {/* <View style={{flex: 1}}> */}
            <KeyboardAwareScrollView keyboardShouldPersistTaps={'handled'}>
                <View style={{backgroundColor: colors.primary, borderBottomLeftRadius: 30, borderBottomRightRadius: 30}}>
                    <ImageBackground source={require('./../../asset/topImage.png')} style={{width: '100%', height: 230}}>
                        <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold', textAlign: 'center', padding: 10}}>NEW RECORDING</Text>
                    </ImageBackground>
                    {/* <View style={{alignItems: 'center', justifyContent: 'center', margin: 20}}>
                        <TouchableOpacity
                            onPress={handleStart}>
                            <Image source={require('../../asset/recordmp3.png')} style={{width: 45, height: 45}}/>
                        </TouchableOpacity>
                    </View> */}
                    <View style={{margin: 20, flexDirection: 'row', justifyContent: 'space-around'}}>
                        <FontAwesome name='pause-circle' size={50} color={recording==null?'grey':'white'}
                        onPress={handlePause}/>
                        <FontAwesome name='play-circle' size={50} color={recording==null?'white':'grey'}
                        onPress={handleStart}/>
                        <FontAwesome name='stop-circle' size={50} color={recording==true?'white':'grey'}
                        onPress={handleStop}/>
                    </View>
                    <Text style={{textAlign: 'center', color: 'white', fontSize: 24, fontWeight: 'bold'}}>{minutes.toString().padStart(2, '0')+':'+secs.toString().padStart(2, '0')}</Text>
                    <View style={{margin: 20, flexDirection: 'row', justifyContent: 'space-between'}}>
                        <LinearGradient
                            colors={['#1BBD29', '#44C127', '#6DC921', '#A2D11E', '#DCD118', '#DCD118', '#E6A311', '#E6A311', '#030003']}
                            start={{x: 0, y: 0}} end={{x: random, y: 0}}
                            style={{width: '100%', height: 30, borderColor: colors.primary, borderWidth: 1}}/>
                    </View>
                    <View style={{margin: 20, flex: 1}}>
                        <Text style={styles.newlineWhite}>Speaker's name</Text>
                        <RNPickerSelect
                            // placeholder={{label: 'select speaker', value: null}}
                            value={speaker}
                            style={{inputAndroid: styles.pickerStyles, inputIOS: styles.pickerStyles, iconContainer: {top: 15, right: 15}}}
                            onValueChange={handleSpeaker}
                            useNativeAndroidPickerStyle={false}
                            Icon={() => {
                                return <Entypo color={colors.primary} size={15} name='chevron-down'/>;
                            }}
                            items={speakers}
                        />
                        <Text style={styles.newlineWhite}>Description</Text>
                        <TextInput
                            style={styles.multiline2}
                            placeholder='Some text that contain description of recording'
                            placeholderTextColor={colors.border}
                            multiline
                            value={description}
                            onChangeText={handleDescription}
                        />
                    </View>
                </View>
                <View style={{flexDirection: 'row', marginTop: 20, marginBottom: 20, justifyContent: 'space-around'}}>
                    <Button
                        title='CANCEL'
                        type='outline'
                        containerStyle={{width: 150}}
                        titleStyle={{color: '#AAAAAA', fontSize: 14}}
                        onPress={handleCancel}
                    />
                    <Button
                        title='SAVE'
                        containerStyle={{width: 150}}
                        titleStyle={{fontSize: 14}}
                        buttonStyle={{backgroundColor: colors.primary}}
                        onPress={handleSave}
                    />
                </View>
                <Spinner visible={spining} />
            </KeyboardAwareScrollView>
            {/* </View> */}
        </SafeAreaView>
    )
}
