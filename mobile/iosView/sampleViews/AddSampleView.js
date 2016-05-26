/**
 * Created by synerzip on 11/03/16.
 */
 var React = require('react-native');
 var {
     ScrollView,
     StyleSheet,
     TabBarIOS,
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
     AsyncStorage,

      NativeModules: {
     ImagePickerManager,
   }

     } = React;


import {Actions} from 'react-native-router-flux'
import config from 'common/config';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as samplesCreator from 'common/actions/samples';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Dimensions } from 'react-native';
import dismissKeyboard from 'react-native-dismiss-keyboard';
var {width, height} = require('Dimensions').get('window');

var AppStyles = require('../styles.ios');

class AddSampleView extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          sampleResponse: 'RESPONSE',
          description: '',
          sampleCode: '',
          sampleName: '',
          selectedImage :null,
          createdSampleId :'',

      };
  }


  componentWillMount () {
  }

  componentWillUnmount(){
      dismissKeyboard();
  }

  onSampleNameSubmit() {
      if (this.state.sampleName && this.state.sampleName.trim() != '' && !this.props.sampleEditStarted && this.state.sampleCode.trim() == '') {
          this.refs.sampleCode.focus();
      }
  }

  onSampleCodeSubmit() {
    if (this.state.sampleCode && this.state.sampleCode.trim() != '' && !this.props.sampleEditStarted && this.state.description.trim() == '') {
        this.refs.description.focus();
    }
}

componentWillReceiveProps(nextProps) {
   if(nextProps.sampleCreatedRequestStarted) {
       if (!nextProps.sampleCreated && nextProps.sampleCreationErrorMessage) {
           AlertIOS.alert(nextProps.sampleCreationErrorMessage);
       }else if(nextProps.sampleCreated){
           this.setState({'sampleResponse':JSON.stringify(nextProps.sampleResponse)});
           this.onDismiss();
       } else if(nextProps.sampleUploadImageFailed) {
           AlertIOS.alert(nextProps.sampleUploadImageFailed);
       }
     }

      if(nextProps.sampleEditStarted)  {
      this.setState({'sampleName':this.props.selectedSample.name});
      this.setState({'sampleCode':this.props.selectedSample.code});
      this.setState({'description':this.props.selectedSample.description});
      if(nextProps.sampleUpdateCompleted) {
           this.onDismiss();
      }
     }

     if(nextProps.sampleDeleteRequest) {
         if(nextProps.sampleDeleteRequestResponse) {
            this.onDismiss();
         }  else if(nextProps.sampleDeleteRequestFailed) {
              AlertIOS.alert(null,"Fail to delete Sample",this.onDismissDel.bind(this));
         }
     }

   }



 onDismissDel(){
    this.props.sampleActions.onSampleDeleteFinished();
    dismissKeyboard();
 }

 onDismissWithError() {
  dismissKeyboard();
 }


selectSampleImage() {
    const options = {
      title: 'Photo Picker',
      quality: 1,
      maxWidth: 1000,
      maxHeight: 1000,
      storageOptions: {
        skipBackup: true
      }
    };

 ImagePickerManager.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled photo picker');
      } else if (response.error) {
        console.log('ImagePickerManager Error: ', response.error);
      }else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }else {
        // You can display the image using either:
        //const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};
        const source = {uri: response.uri.replace('file://', ''), isStatic: true};
        this.setState({
          selectedImage: source
        });
      }
    });
  }

onCreateSampleRequest() {
  dismissKeyboard();
  if(config.NETWORK_STATUS) {
  if(this.props.sampleEditStarted) {
    if(this.state.sampleName.trim() == '' || this.state.description.trim() == '') {
       AlertIOS.alert('All fields are compulsary');
        return;
    }

    var imageURI = null;
    if(this.state.selectedImage != null) {
      imageURI =this.state.selectedImage.uri;
    }
    this.props.sampleActions.updateSample(this.state.description, this.state.sampleName, "Free",
    this.state.sampleCode,imageURI, this.props.selectedSample.id);
  } else {
     if(this.state.sampleName.trim() == '' || this.state.description.trim() == '' || this.state.selectedImage == null) {
        AlertIOS.alert('All fields are compulsary');
         return;
     }

     this.props.sampleActions.createSample(this.state.description, this.state.sampleName, "Free",
     this.state.sampleCode,this.state.selectedImage.uri);
  }
} else {
  AlertIOS.alert('Not connected to Internet');
}
}

onDismiss() {
  dismissKeyboard();
  Actions.pop();
  this.props.sampleActions.onEditSampleFinished();
}

onDescritionFocus(e) {
  this.refs.scrollView.scrollToFocusedInput(e, React.findNodeHandle(this.refs.description), 68);
}

onSampleNameFocus(e) {
  this.refs.scrollView.scrollToFocusedInput(e, React.findNodeHandle(this.refs.sampleName), 68);
}

onSampleCodeFocus(e) {
  this.refs.scrollView.scrollToFocusedInput(e, React.findNodeHandle(this.refs.sampleCode), 68);
}

deleteSample() {
    if(config.NETWORK_STATUS) {
      this.props.sampleActions.deleteSample(this.props.selectedSample.id, true);
    } else {
      AlertIOS.alert('Not connected to Internet');
    }
}

showConfirmationAlert() {
  AlertIOS.alert(
         null,
         "Are you sure you want to delete Sample?",
         [
           {text: 'Yes', onPress: () => this.deleteSample()},
           {text: 'No'},
         ]
       )
}

renderImage() {

    var imageUri;
    if(this.props.sampleEditStarted && this.state.selectedImage == null){
        if(this.props.selectedSample.image != null){
          imageUri = this.props.selectedSample.image;
        } else {
          imageUri = null;
        }

        if(imageUri != null) {
          return (
            <Image style={styles.sampleImageStyle} source={{uri:imageUri}} resizeMode={Image.resizeMode.contain}/>
          );
        } else {
          return(
            <Text style={{height :0,width :0}}></Text>
          );
        }

    } else {
        if(this.state.selectedImage != null) {
          imageUri =this.state.selectedImage;
        } else {
          imageUri =null;
        }
        if(imageUri != null) {
          return (
            <Image style={styles.sampleImageStyle} source={imageUri}  resizeMode={Image.resizeMode.contain}/>
          );
        } else {
          return(
            <Text style={{height :0,width :0}}></Text>
          );
        }
    }
}



render() {
  return (
      <View style={{flex : 1}}>
      <View style={AppStyles.customNavBar}>
                      <View style={{flex: 0.3}}>
                          <TouchableOpacity style={[AppStyles.navButtonContainer,{flex:1}]}
                                            onPress={this.onDismiss.bind(this)}>
                              <View style={[AppStyles.navButtonContainer,{flex:1}]}>
                                  <View style={AppStyles.navButtonLabelContainer} >
                                      <Text style={AppStyles.navBarButtonLabel} allowFontScaling={true}>Cancel</Text>
                                  </View>
                              </View>
                          </TouchableOpacity>
                      </View>
                      <View style={AppStyles.navBarTitleContainer}>
                        {this.props.sampleEditStarted ? <Text style={AppStyles.navBarTitle} allowFontScaling={true}>UPDATE SAMPLE</Text> :
                        <Text style={AppStyles.navBarTitle}>CREATE SAMPLE</Text>}

                      </View>
                      <View style={{flex: 0.3}}>
                          <TouchableOpacity style={[AppStyles.navButtonContainer,{flex:1}]} onPress={this.onCreateSampleRequest.bind(this)} ref ="donebutton">
                              <View style={[AppStyles.navButtonContainer,{paddingRight:10,flex:1,justifyContent:'flex-end'}]}>
                                  <View style={AppStyles.navButtonLabelContainer}>
                                      <Text style={AppStyles.navBarButtonLabel}>Done</Text>
                                  </View>
                              </View>
                          </TouchableOpacity>
                      </View>
                  </View>
     <View style={{height :1, backgroundColor : '#D8D8D6'}}>
     </View>


   <KeyboardAwareScrollView style = {styles.container} ref="scrollView" style={styles.container} automaticallyAdjustContentInsets={true} >
      <View>

        <TouchableOpacity onPress={this.selectSampleImage.bind(this)}>
            <View style={styles.imageContainer} onPress={this.selectSampleImage.bind(this)}>
                <View style={{flex : 0}}>
                    {this.renderImage(this)}
                     <TouchableOpacity style = {{alignSelf : 'flex-end', marginTop :20, marginRight : 24}} onPress={this.selectSampleImage.bind(this)}>
                       <Image source={require('common/images/camera_image.png')}/>
                     </TouchableOpacity>
                </View>
           </View>
         </TouchableOpacity>


            <TextInput
                style={[AppStyles.textFieldStyle, {marginTop: 10}]}
                ref="sampleName"
                placeholder="Sample Name"
                onChangeText={(sampleName) => this.setState({sampleName})}
                placeholderTextColor="#CCCCCC"
                autoCorrect={false}
                clearButtonMode="always"
                onEndEditing={this.onSampleNameSubmit.bind(this)}
                returnKeyType="next"
                selectTextOnFocus
                enablesReturnKeyAutomatically
                keyboardAppearance="light"
                autoCapitalize="sentences"
                defaultValue={this.state.sampleName}
                onFocus={this.onSampleNameFocus.bind(this)}
                maxLength={250}
                />
              <TextInput
                  style={[AppStyles.textFieldStyle, {marginTop: 2}]}
                  ref="sampleCode"
                  placeholder="Sample Code (Optional)"
                  onChangeText={(sampleCode) => this.setState({sampleCode})}
                  placeholderTextColor="#CCCCCC"
                  autoCorrect={false}
                  clearButtonMode="always"
                  onEndEditing={this.onSampleCodeSubmit.bind(this)}
                  returnKeyType="next"
                  selectTextOnFocus
                  enablesReturnKeyAutomatically
                  keyboardAppearance="light"
                  autoCapitalize="none"
                  defaultValue={this.state.sampleCode}
                  onFocus={this.onSampleCodeFocus.bind(this)}
                  maxLength={24}
                  />
              <TextInput
                  style={[AppStyles.textFieldStyle, {marginTop: 10,height: 150, marginBottom:20}]}
                  ref="description"
                  placeholder="Description..."
                  placeholderTextColor="#CCCCCC"
                  autoCorrect={false}
                  clearButtonMode="always"
                  onChangeText={(description) => this.setState({description})}
                  multiline={true}
                  returnKeyType="default"
                  selectTextOnFocus
                  enablesReturnKeyAutomatically
                  keyboardAppearance="light"
                  autoCapitalize="sentences"
                  onFocus={this.onDescritionFocus.bind(this)}
                  defaultValue={this.state.description}
                  maxLength={250}
                    />

                {this.props.sampleEditStarted && this.props.selectedSample.numOfTrials == 0?
                <TouchableOpacity style = {{flex:1, flexDirection:'row',
                  backgroundColor:'#FF2600',height: 44, marginBottom:20,
                   borderRadius: 3,
                   justifyContent:'center'}} onPress={this.showConfirmationAlert.bind(this)}>
                    <Text style={[{
                        fontSize : 14,
                        fontFamily: 'Helvetica Neue',
                        fontWeight: '400',
                        color:'white',
                        alignSelf:'center'
                     }]}>DELETE
                      </Text>
                  </TouchableOpacity> : <View/>}


        </View>
      </KeyboardAwareScrollView>
    </View>
          )
      }

    }
var styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: '#F1F1EF',
    paddingLeft :20,
    paddingRight : 20,
},
imageContainer: {
    height : width-40,
    backgroundColor: '#FFFFFF',
    marginTop: 26,
    borderRadius :3
},
fieldBox: {
    borderRadius: 3,
    marginTop: 10
},
sampleImageStyle: {
  flex: 0,
  top:0,
  left:0,
  position : 'absolute',
  height : width-40,
  width :width-40,
  borderRadius:5
},
  });


const mapStateToProps = (state) => ({
    "sampleCreatedRequestStarted": state.sample.sampleCreatedRequestStarted,
    "sampleCreated": state.sample.sampleCreated,
    "sampleCreationErrorMessage": state.sample.sampleCreationError,
    "sampleResponse": state.sample.sampleResponse,
    "sampleUploadImageFailed" : state.sample.sampleUploadImageFailed,
    "selectedSample": state.sample.selectedSample,
    "sampleEditStarted":state.sample.sampleEditStarted,
    "sampleUpdateRequest":state.sample.sampleUpdateRequest,
    "sampleUpdateCompleted":state.sample.sampleUpdateCompleted,
    "sampleUpdateResponse":state.sample.sampleUpdateResponse,
    "sampleUpdateFailed":state.sample.sampleUpdateFailed,
    "sampleDeleteRequest":state.sample.sampleDeleteRequest,
    "sampleDeleteRequestResponse":state.sample.sampleDeleteRequestResponse,
    "sampleDeleteRequestFailed":state.sample.sampleDeleteRequestFailed,
});

const mapDispatchToProps = (dispatch) => ({
    'sampleActions': bindActionCreators(samplesCreator, dispatch)
});


export default connect(mapStateToProps, mapDispatchToProps)(AddSampleView);
