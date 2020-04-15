import React, {useState, useEffect, useContext} from 'react'
import {
    SafeAreaView,
    Text,
    View,
    StyleSheet,
    TextInput,
    FlatList,
    TouchableOpacity
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import Fontisto from 'react-native-vector-icons/Fontisto'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {NavigationContext} from 'react-navigation'
import RNPickerSelect from 'react-native-picker-select'
import Entypo from 'react-native-vector-icons/Entypo'
import KeepAwake from 'react-native-keep-awake'
import { useSelector, useDispatch } from 'react-redux'
import AwesomeAlert from 'react-native-awesome-alerts'
import Toast from 'react-native-simple-toast'
import SegmentedControlTab from "react-native-segmented-control-tab"
import { Overlay, Button, Divider, CheckBox } from 'react-native-elements'
import Spinner from "react-native-loading-spinner-overlay"

import colors from './../common/colors'
import Radio from '../components/Radio'
import styles from '../common/styles'
import {removeFile, saveUser} from '../redux/action'
import LoginDialog from '../components/LoginDialog'
import {SERVER_ADDRESS,
    LOGIN, CREATE_POST,
    GET_SUBJECTS,
    CREATE_MEDIA
} from '../common/constant'

export default function Recordmp3() {
    const navigation = useContext(NavigationContext)
    const [today, setToday] = useState(new Date())
    const dispatch = useDispatch()
    const [date, setDate] = useState(`${today.getDate()}/${today.getMonth()+1}/${today.getFullYear()}`)
    const [subjectMode, setMode] = useState('Free')
    // const [introSong, setIntroSong] = useState(['intro1', 'intro2', 'intro3', 'intro4'])
    // const [outroSong, setOutroSong] = useState(['outro1', 'outro2', 'outro3'])
    const [introSong, setIntroSong] = useState('')
    const [outroSong, setOutroSong] = useState('')
    // const [seletedIntro, setSelectedIntro] = useState(null)
    // const [seletedOutro, setSelectedOutro] = useState(null)
    const [freeSubject, setFreeSubject] = useState('')
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [definedSubject, setDefinedSubject] = useState([])
    const [selectedSubject, setSelectedSubject] = useState(0)
    const settings = useSelector(state=>state.settings)
    const recorded = useSelector(state=>state.recorded)
    const user = useSelector(state=>state.user)
    const [visibleLoginScreen, setVisibleLoginScreen] = useState(false)
    const [spining, setSpining] = useState(false)
    const [successAlert, setSuccessAlert] = useState(false)
    // const handleMode = (value, mode) => {
    //     if (!value) {
    //         setMode(mode)
    //     }
    // }
    const handleMode = index => {
        if (index == 0) {
            setMode('Free')
            return
        }
        setMode('Defined')
        return
    }

    const handleSubject = text => {
        setFreeSubject(text)
    }
    const handleDate = (event, date) => {
        setShowDatePicker(false)
        if (date) {
            setToday(date)
        }
    }
    const handleRecord = () => {
        if (subjectMode == 'Free') {
            navigation.push('Free', {subject: freeSubject})
            // if (subject) {
            //     navigation.push('Free', {subject})
            //     return        
            // }
            // Toast.show('Write subject!')
            return
        }
        if (subjectMode == 'Defined') {
            navigation.push(subjectMode, {subject: definedSubject[selectedSubject]})
            // if (selectedSubject) {
            //     navigation.push(subjectMode, {subject: selectedSubject})
            //     return
            // }
            // Toast.show('Select subject!')
        }
        return
    }
    useEffect(()=>{
        if (today) {
            setDate(`${today.getDate()}/${today.getMonth()+1}/${today.getFullYear()}`)
        }
    }, [today])
    useEffect(()=>{
        setSpining(true)
        fetch(SERVER_ADDRESS+GET_SUBJECTS)
        .then(response=>response.json())
        .then(results=>{
            setSpining(false)
            const subjects = []
            for (var index=0;index<results.length;index++) {
                const result = results[index]
                subjects.push({
                    label: result.name,
                    value: index,
                    id: result.id,
                    detail: result.description
                })
            }
            setDefinedSubject(subjects)
        })
    }, [])
    const handleDefinedSubject = value => {
        setSelectedSubject(value)
    }
    if (settings.disableSleep) {
        KeepAwake.activate()
    } else {
        KeepAwake.deactivate()
    }
    const handleRemove = index => {
        setRemoveModalVisible({visible: true, item: index})
    }
    const renderRecoreded = ({item, index}) => {
        console.log('item:', item)
        const duration = item.duration
        const minutes = Math.floor(duration/60000)
        const secs = Math.floor((duration%60000)/1000)
        return (
            <View style={{margin: 2}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', padding: 5, backgroundColor: 'white'}}>
                <Text>
                    {
                    item.type=='free'
                    ?
                    `${item.subject}(${item.speaker.label})(${minutes.toString().padStart(2, '0')+':'+secs.toString().padStart(2, '0')})`
                    :
                    `${item.subject.label}(${minutes.toString().padStart(2, '0')+':'+secs.toString().padStart(2, '0')})`
                    }
                </Text>
                <AntDesign name='closecircle' color={colors.warning} size={25}
                onPress={()=>handleRemove(index)}/>
            </View>
            </View>
        )
    }
    const [removeModalVisible, setRemoveModalVisible] = useState({visible: false, item: null})
    const handleSubmit = () => {
        if (recorded.length <= 0) {
            Toast.show('You can submit after record audio at least one.')
            return
        }
        if (user.token) {
            createPost()
            return
        }
        setVisibleLoginScreen(true)
        return
    }
    const createPost = () => {
        setSpining(true)
        fetch(SERVER_ADDRESS+CREATE_POST, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
                'Authorization': 'Bearer '+user.token
            },
            body: JSON.stringify({
                categories: subjectMode=='Free'?3:2,
                title: 'Recorded by app',
            })
        })
        .then(response=>{
            return response.json()
        })
        .then(json=>{
            const id = json['id']
            Promise.all(recorded.map(audio=>uploadMedia(audio))).then(uploadAudios=>{
                const deroulement_edif = []
                if (subjectMode == 'Free') {
                    deroulement_edif.push({
                        type_edif: 'Cantique',
                        cantique_edif: introSong
                    })
                } else {
                    deroulement_edif.push({
                        type: 'Cantique',
                        cantique: introSong
                    })
                }
                for (const uploadAudio of uploadAudios) {
                    if (subjectMode == 'Free' && uploadAudio.type == 'free') {
                        deroulement_edif.push({
                            type_edif: 'Enregistrement',
                            orateurs_edif: uploadAudio.speaker.id,
                            sujet_edif: freeSubject,
                            mp3_repet_edif: uploadAudio.id
                            // subject_defined: false,
                            // free_subject: freeSubject,
                            // speaker: uploadAudio.speaker.id,
                            // description: uploadAudio.description,
                            // audio: uploadAudio.id
                        })
                    } else if (subjectMode == 'Defined' && uploadAudio.type == 'defined') {
                        deroulement_edif.push({
                            type: 'Enregistrement',
                            mp3: uploadAudio.id,
                            defined_subject: definedSubject[selectedSubject].id
                            // subject_defined: true,
                            // subject: definedSubject[selectedSubject].id,
                            // audio: uploadAudio.id
                        })
                    }
                }
                console.log('deroulement_edif:', deroulement_edif)
                if (subjectMode == 'Free') {
                    deroulement_edif.push({
                        type_edif: 'Cantique',
                        cantique_edif: outroSong
                    })
                } else {
                    deroulement_edif.push({
                        type: 'Cantique',
                        cantique: outroSong
                    })
                }
                const fields = subjectMode=='Free'?
                {
                    date_edif: date,
                    deroulement_edif
                }:
                {
                    date,
                    deroulement: deroulement_edif
                }
                console.log('fields:', fields)
                fetch(SERVER_ADDRESS+CREATE_POST+'/'+id, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'accept': 'application/json',
                        'Authorization': 'Bearer '+user.token
                    },
                    body: JSON.stringify({
                        title: 'Recorded by app',
                        status: 'publish',
                        fields
                        // fields: {
                        //     deroulement_edif:
                        //     intro_song: introSong,
                        //     outro_song: outroSong,
                        //     date: date,
                        //     mp3
                        // }
                    })
                })
                .then(response=>{
                    return response.json()
                })
                .then(result=>{
                    setSpining(false)
                    setSuccessAlert(true)
                })
                .catch(error=>{
                    setSpining(false)
                })
    
            }).catch(error=>{
                setSpining(false)
            })
        })
        .catch(error=>{
            setSpining(false)
        })

    }
    const uploadMedia = audio => {
        return new Promise((resolve, reject)=>{
            const formData = new FormData()
            formData.append('file', {
                uri: 'file://'+audio.path,
                type: 'audio/mp3',
                name: `/${Date.now()}.mp3`
            })
            fetch(SERVER_ADDRESS+CREATE_MEDIA, {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': 'Bearer '+user.token,
                    Accept: 'application/json'
                },
                body: formData
            }).then(response=>{
                return response.json()
            }).then(json=>{
                if (json['id']) {
                    audio['id'] = json['id']
                    resolve(audio)
                } else {
                    reject(null)
                }
            }).catch(error=>reject(error))
        })
    }
    const handleLoginDialog = (bLogin, username, password, remember) => {
        if (!bLogin) {
            setVisibleLoginScreen(false)
            return
        }
        setSpining(true)
        fetch(SERVER_ADDRESS+LOGIN, {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
                'accept': 'application/json',
            },            
            body: JSON.stringify({
                username,
                password
            })
        })
        .then(response=>{
            return response.json()
        })
        .then(result=>{
            if (result.token) {
                if (remember) {
                    dispatch(saveUser(username, result.token))
                }
                setSpining(false)
                setVisibleLoginScreen(false)
                createPost()
            } else {
                setSpining(false)
                setVisibleLoginScreen(false)
            }
        })
        .catch(error=>{
            setSpining(false)
            setVisibleLoginScreen(false)
        })
    }
    return (
        <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
            <KeyboardAwareScrollView keyboardShouldPersistTaps={'handled'}>
            <View style={styles.row}>
                <SegmentedControlTab
                    values={['Free Subject', 'Defined Subject']}
                    selectedIndex={subjectMode=='Free'?0:1}
                    onTabPress={handleMode}
                />
                {/* <Radio
                    label='Free subject'
                    color={colors.primary}
                    value={subjectMode=='Free'}
                    onChange={value=>handleMode(value, 'Free')}
                />

                <Radio label='Defined subject'
                    radioOuterStyle={{marginLeft: 20}}
                    color={colors.primary}
                    value={subjectMode=='Defined'}
                    onChange={value=>handleMode(value, 'Defined')}
                /> */}
            </View>
            <Text style={styles.text1}>Subject</Text>
            {
                subjectMode == 'Defined' &&
                <>
                <View style={{marginHorizontal: 20, marginTop: 10}}>
                    <RNPickerSelect
                        // placeholder={{label: 'Select subject', value: null}}
                        value={selectedSubject}
                        style={{inputAndroid: styles.pickerBlackStyles, inputIOS: styles.pickerBlackStyles, iconContainer: {top: 15, right: 15}}}
                        onValueChange={handleDefinedSubject}
                        useNativeAndroidPickerStyle={false}
                        Icon={() => {
                            return <Entypo color={colors.primary} size={15} name='chevron-down'/>;
                        }}
                        items={definedSubject}
                    />
                </View>
                <View style={{marginHorizontal: 20}}>
                    <Text style={styles.newline}>Subject detail</Text>
                    <TextInput
                        style={styles.multiline}
                        multiline
                        editable={false}
                        value={selectedSubject?definedSubject[selectedSubject].detail:''}
                    />
                </View>
                </>
            }
            {
                subjectMode == 'Free' &&
                <TextInput
                    style={styles.textInput}
                    placeholder='Some text that contains subject'
                    value={freeSubject}
                    onChangeText={handleSubject}
                />
            }
            <Text style={styles.text1}>Date</Text>
            <View style={styles.row}>
                <TextInput
                    style={styles.date}
                    value={date}
                />
                <Fontisto color={colors.primary} name='date' size={25} style={{marginLeft: 20}}
                onPress={()=>setShowDatePicker(true)}/>
            </View>
            <Text style={styles.text1}>Intro song</Text>
            <TextInput
                defaultValue={introSong}
                placeholder='Intro song'
                style={styles.textInput}
                onChangeText={text=>setIntroSong(text)}/>
            {/* <View style={styles.introSong}>
                <FlatList
                    data={introSong}
                    keyExtractor={(item, index)=>index.toString()}
                    renderItem={({item, index})=><TouchableOpacity style={{backgroundColor: index==seletedIntro?colors.primary:'white'}} onPress={()=>setSelectedIntro(index)}><Text style={{color: index==seletedIntro?'white':'black'}}>{item}</Text></TouchableOpacity>}
                    />
            </View> */}
            <Text style={styles.text1}>Recording(s)</Text>
            {/* <View style={styles.row}>
                <Text>Recording(s)</Text>
                <AntDesign
                    name='pluscircleo'
                    color={colors.primary}
                    size={20}
                    style={{marginLeft: 20}}
                    onPress={handleRecord}
                />
            </View> */}
            <View style={styles.recordings}>
                <FlatList
                    data={recorded}
                    keyExtractor={(item, index)=>index.toString()}
                    renderItem={renderRecoreded}
                    ListFooterComponent={
                        <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 10}}
                        onPress={handleRecord}
                        >
                            <AntDesign
                                name='plus'
                                color={colors.primary}
                                size={20}
                                style={{marginLeft: 20}}
                            />
                            <Text style={{color: colors.primary, fontSize: 14, marginLeft: 5}}>Add new recording</Text>
                        </TouchableOpacity>
                    }
                />
            </View>
            <Text style={styles.text1}>Outro song</Text>
            <TextInput
                defaultValue={outroSong}
                placeholder='Outtro song'
                style={[{...styles.textInput}, {textAlignVertical: 'top'}]}
                multiline
                numberOfLines={3}
                onChangeText={text=>setOutroSong(text)}/>
            {/* <View style={styles.outroSong}>
                <FlatList
                    data={outroSong}
                    keyExtractor={(item, index)=>index.toString()}
                    renderItem={({item, index})=><TouchableOpacity style={{backgroundColor: index==seletedOutro?colors.primary:'white'}} onPress={()=>setSelectedOutro(index)}><Text style={{color: index==seletedOutro?'white':'black'}}>{item}</Text></TouchableOpacity>}
                    />
            </View> */}
            <View style={styles.submit}>
                <Button
                    buttonStyle={{backgroundColor: colors.primary}}
                    title='Submit'
                    onPress={handleSubmit}/>
            </View>
            </KeyboardAwareScrollView>
            {
                showDatePicker &&
            <DateTimePicker
                value={new Date()}
                onChange={handleDate}
            />

            }
            <AwesomeAlert
                show={removeModalVisible.visible}
                showProgress={false}
                message='Are you sure to remove?'
                closeOnTouchOutside={false}
                closeOnHardwareBackPress={false}
                showCancelButton={true}
                showConfirmButton={true}
                cancelText="No, cancel"
                confirmText="Yes, delete it"
                confirmButtonColor="#DD6B55"
                onCancelPressed={() => {
                    setRemoveModalVisible({visible: false, item: null})
                }}
                onConfirmPressed={() => {
                    const index = removeModalVisible.item
                    dispatch(removeFile(index))
                    setRemoveModalVisible({visible: false, item: null})
                }}
            />
            <LoginDialog
                visibleLogin={visibleLoginScreen}
                onLogin={handleLoginDialog}
            />
            <AwesomeAlert
                show={successAlert}
                title='SUCCESS'
                message='You have done successsfully'
            />
            <Spinner visible={spining} />
        </SafeAreaView>
    )
}

