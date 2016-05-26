/**
 * Created by synerzip on 26/02/16.
 */
import React, {
    AppRegistry,
    Component,
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {MKButton,MKColor} from 'react-native-material-kit';

class WelcomeView extends React.Component {
    render() {
      console.log("WelcomeView");
        return (
            <View style={{flex:1,backgroundColor: '#F8F8F8'}}>

                <View style={styles.container}>

                    <Text style={styles.welcome}>
                        Welcome!
                    </Text>
                    <Text style={styles.instructions}>
                        Welcome to the Field Test App {'\n'}
                        Continue below to create your {'\n'} account or log in.
                    </Text>

                    <View style={styles.buttonContainer}>
                        <View style={styles.loginButton}>
                            <MKButton
                                backgroundColor={MKColor.Teal}
                                style={{height:30,borderRadius:3,alignItems:'center',justifyContent:'center'}}
                                shadowRadius={2}
                                shadowOffset={{width:0, height:2}}
                                shadowOpacity={.7}
                                shadowColor="black"
                                onPress={() => Actions.login()} >
                                <Text pointerEvents="none"
                                      style={{color: 'white', fontWeight: 'bold',}}>
                                    LOGIN
                                </Text>
                            </MKButton>

                        </View>
                        <View style={styles.signupButton}>
                            <MKButton
                                backgroundColor={MKColor.Grey}
                                style={{height:30,borderRadius:3,alignItems:'center',justifyContent:'center'}}
                                shadowRadius={2}
                                shadowOffset={{width:0, height:2}}
                                shadowOpacity={.7}
                                shadowColor="black">
                                <Text pointerEvents="none"
                                      style={{color: 'white', fontWeight: 'bold',}}>
                                    SIGNUP
                                </Text>
                            </MKButton>

                        </View>
                    </View>

                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8F8F8',
        marginBottom:40
    },
    messageBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8F8F8',
    },
    buttonContainer: {
        height: 30,
        marginTop: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
        color: '#9E9CA2'
    },
    instructions: {
        textAlign: 'center',
        color: '#9E9CA2',
        marginBottom: 5,
    },
    loginButton: {

        width: 100,
        marginRight: 10,
    },
    buttonLabel: {
        color: '#FFFFFF'
    },
    signupButton: {
        backgroundColor: '#86898E',
        width: 100,
        marginLeft: 10,
        borderRadius:3
    },
    statusBar: {
        backgroundColor: '#EFEEF2',
        height: 55
    },
    separator:{
        height:1,
        backgroundColor:'#E0E0E1'
    }
});

export default WelcomeView;
