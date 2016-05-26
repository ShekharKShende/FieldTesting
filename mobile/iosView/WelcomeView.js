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
import {Actions} from 'react-native-router-flux'

class WelcomeView extends React.Component {
    render() {
        return (
            <View style={{flex:1,backgroundColor: '#F8F8F8'}}>
                <View style={styles.statusBar}>

                </View>
                <View style={styles.separator} />
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
                            <TouchableOpacity style={{flex:1,alignItems:'center',padding: 5}}
                                onPress={()=>Actions.login()}>
                                <Text style={styles.buttonLabel}>LOGIN</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.signupButton}>
                            <TouchableOpacity style={{flex:1,alignItems:'center',padding: 5}}>
                                <Text style={styles.buttonLabel}>SIGNUP</Text>
                            </TouchableOpacity>
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
        backgroundColor: '#3BC0F0',
        width: 100,
        marginRight: 10,
        borderRadius:3
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