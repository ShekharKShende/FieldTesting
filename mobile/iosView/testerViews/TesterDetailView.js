/**
 * Created by synerzip on 09/02/16.
 */
var React = require('react-native');
var {
    ScrollView,
    StyleSheet,
    Text,
    View,
    Image,
    LayoutAnimation,
    ActivityIndicatorIOS,
    StatusBarIOS,
    TextInput,
    Navigator,
    AlertIOS,
    Switch,
    TouchableOpacity,
    Linking
    } = React;

import config from 'common/config';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as testerActionCreator from 'common/actions/tester';
import {Actions} from 'react-native-router-flux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
var AppStyles = require('../styles.ios');
import * as testerCreator from 'common/actions/tester';
import dismissKeyboard from 'react-native-dismiss-keyboard';

class TesterDetailView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentWillUnmount(){
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.testerDeleteRequest) {
            if(nextProps.testerDeleteResponse) {
                 this.onDismiss();
            }
        }
    }

    onDismiss() {
      Actions.pop();   
    }

    onEditTester() {
      Actions.TesterEditView();
    }

    openEmailClient() {
        Linking.canOpenURL("mailto:"+this.props.testerSelected.emailAddress).then(supported => {
         if (supported) {
           Linking.openURL("mailto:"+this.props.testerSelected.emailAddress);
         } else {
           console.log("Email Id is not a valid");
         }
       });
    }
    render() {
        return (
            <View style={AppStyles.defaultContainer}>
              <View style={AppStyles.customNavBar}>
                    <View style={{flex: 0.3}}>
                        <TouchableOpacity style={[AppStyles.navButtonContainer,{flex:1}]}
                                          onPress={this.onDismiss.bind(this)}>
                            <View style={[AppStyles.navButtonContainer,{flex:1}]}>
                                <View style={AppStyles.navButtonLabelContainer} >
                                    <Text style={AppStyles.navBarButtonLabel}>Cancel</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={AppStyles.navBarTitleContainer}>
                        <Text style={AppStyles.navBarTitle}>{this.props.testerSelected.firstName+" "+this.props.testerSelected.lastName}</Text>
                    </View>
                    <View style={{flex: 0.3}}>
                        <TouchableOpacity style={[AppStyles.navButtonContainer,{flex:1}]} ref ="donebutton" onPress={this.onEditTester.bind(this)}>
                            <View style={[AppStyles.navButtonContainer,{paddingRight:10,flex:1,justifyContent:'flex-end'}]}>
                                <View style={AppStyles.navButtonLabelContainer}>
                                    <Text style={AppStyles.navBarButtonLabel}>Edit</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{height :1, backgroundColor : '#D8D8D6'}}></View>
                <KeyboardAwareScrollView ref="scrollView" style={styles.container} automaticallyAdjustContentInsets={false}>
                    <View style={styles.loginBox}>
                        <View style={{flex:1}}>
                                <TextInput
                                    style={[AppStyles.textFieldStyle, {marginTop: 10}]}
                                    ref="firstName"
                                    onChangeText={(firstName) => this.setState({firstName})}
                                    placeholder="First Name"
                                    placeholderTextColor="#CCCCCC"
                                    autoCorrect={false}
                                    clearButtonMode="never"
                                    value={this.state.firstName}
                                    returnKeyType="next"
                                    selectTextOnFocus
                                    enablesReturnKeyAutomatically
                                    keyboardAppearance="light"
                                    autoCapitalize="sentences"
                                    editable = {false}
                                    defaultValue ={this.props.testerSelected.firstName}
                                    />
                                <TextInput
                                    ref='lastName'
                                    style={[AppStyles.textFieldStyle, {marginTop: 2}]}
                                    onChangeText={(lastName) => this.setState({lastName})}
                                    placeholder="Last Name"
                                    placeholderTextColor="#CCCCCC"
                                    autoCorrect={false}
                                    clearButtonMode = {"never"}
                                    value={this.state.lastName}
                                    returnKeyType="next"
                                    selectTextOnFocus
                                    enablesReturnKeyAutomatically
                                    keyboardAppearance="light"
                                    autoCapitalize="sentences"
                                    editable = {false}
                                    defaultValue ={this.props.testerSelected.lastName}
                                    />
                                <TouchableOpacity style={{marginTop: 2}} onPress={this.openEmailClient.bind(this)}>
                                   <TextInput
                                      ref='email'
                                      style={[AppStyles.textFieldStyle, {color:"#1F7EF6"}]}
                                      onChangeText={(email) => this.setState({email})}
                                      placeholder="Email"
                                      placeholderTextColor="#CCCCCC"
                                      autoCorrect={false}
                                      clearButtonMode="never"
                                      value={this.state.email}
                                      returnKeyType="next"
                                      selectTextOnFocus
                                      enablesReturnKeyAutomatically
                                      keyboardAppearance="light"
                                      autoCapitalize="none"
                                      keyboardType="email-address"
                                      editable = {false}
                                      defaultValue ={this.props.testerSelected.emailAddress}
                                      />
                                  </TouchableOpacity>

                                <TextInput
                                    ref='password'
                                    style={[AppStyles.textFieldStyle, {marginTop: 10}]}
                                    onChangeText={(password) => this.setState({password})}
                                    placeholder="Password"
                                    secureTextEntry
                                    placeholderTextColor="#CCCCCC"
                                    autoCorrect={false}
                                    clearButtonMode="never"
                                    value={this.state.password}
                                    editable={this.state.enablePassword}
                                    returnKeyType="default"
                                    selectTextOnFocus
                                    enablesReturnKeyAutomatically
                                    keyboardAppearance="light"
                                    autoCapitalize="none"
                                    editable = {false}
                                    />
                                <TextInput
                                    ref='organizationId'
                                    style={[AppStyles.textFieldStyle, {marginTop: 10,backgroundColor: '#f5f5f5'}]}
                                    onChangeText={(organizationId) => this.setState({organizationId})}
                                    placeholder={config.ORGANIZATION_ID}
                                    placeholderTextColor="#CCCCCC"
                                    editable={false}
                                    autoCorrect={false}
                                    clearButtonMode="never"
                                    value={this.state.organizationId}
                                    returnKeyType="default"
                                    selectTextOnFocus
                                    enablesReturnKeyAutomatically
                                    keyboardAppearance="light"
                                    autoCapitalize="none"
                                    />
                        </View>
                    </View>
                </KeyboardAwareScrollView>
            </View>
        )
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: config.backgroundColor
    },
    loginBox: {
        flex: 1,
        margin: 24
    },

});

const mapStateToProps = (state) => ({
    "testerSelected": state.tester.testerSelected,
    "testerDeleteRequest":state.tester.testerDeleteRequest,
    "testerDeleteResponse":state.tester.testerDeleteResponse,
    "testerDeleteFailed":state.tester.testerDeleteFailed,
});

const mapDispatchToProps = (dispatch) => ({
    'testerActions': bindActionCreators(testerCreator, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(TesterDetailView);
