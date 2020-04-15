import {StyleSheet} from 'react-native'

export default styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: 'white'
    },
    FontAwesome: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12.5,
        width: 50,
        height: 50,
    },
    pickerStyles: {
        color: 'white',
        borderWidth: 1,
        borderRadius: 4,
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 15,
        paddingRight: 30,
        borderColor: colors.border,
    
    },
    pickerBlackStyles: {
        color: 'black',
        borderWidth: 1,
        borderRadius: 4,
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 15,
        paddingRight: 30,
        borderColor: colors.border,
    
    },
    row: {
        marginTop: 20,
        marginHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    date: {
        borderBottomWidth: 1,
        borderColor: colors.border,
        backgroundColor: 'white',
        // marginLeft: 20,
        paddingVertical: 5,
        flex: 1
    },
    text1: {
        marginLeft: 20, marginTop: 20,
        fontSize: 14, fontWeight: 'bold'
    },
    newline: {
        marginTop: 20, marginBottom: 10,
        fontSize: 14, fontWeight: 'bold'
    },
    newlineWhite: {
        marginTop: 20,
        marginBottom: 10,
        fontSize: 14,
        fontWeight: 'bold',
        color: 'white'
    },
    introSong: {
        marginTop: 10,
        marginHorizontal: 20,
        // height: 100,
        backgroundColor: 'white',
        borderColor: colors.border,
        borderWidth: 1,
    },
    recordings: {
        marginTop: 10,
        marginHorizontal: 20,
        height: 200,
        backgroundColor: '#F5F5F5',
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 5

    },
    textInput: {
        borderColor: colors.border,
        borderBottomWidth: 1,
        marginTop: 10,
        backgroundColor: 'white',
        marginHorizontal: 20,
        paddingVertical: 5
    },
    outroSong: {
        marginTop: 10,
        marginHorizontal: 20,
        height: 150,
        backgroundColor: 'white',
        borderColor: colors.border,
        borderWidth: 1
    },
    submit: {
        margin: 20
    },
    multiline: {
        backgroundColor: 'white',
        borderColor: colors.border,
        borderWidth: 1,
        textAlignVertical: 'top',
        height: 150
    },
    multiline2: {
        backgroundColor: 'transparent',
        borderColor: colors.border,
        borderWidth: 1,
        textAlignVertical: 'top',
        height: 120,
        color: 'white'
    }


})