/**
 * Created by synerzip on 17/03/16.
 */
 var React = require('react-native');
 var {
     ScrollView,
     StyleSheet,
     Text,
     View,
     Image,
     LayoutAnimation,
     TextInput,
     Alert,
     Navigator,
     Switch,
     TouchableOpacity,
     AsyncStorage,
         } = React;


import {Actions} from 'react-native-router-flux'
import config from 'common/config';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as trialActionCreator from 'common/actions/trials';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Dimensions } from 'react-native';
import dismissKeyboard from 'react-native-dismiss-keyboard';
var {width, height} = require('Dimensions').get('window');
var ImagePickerManager = require('NativeModules').ImagePickerManager;
import BaseComponent from '.././BaseComponent'

var AppStyles = require('../styles.ios');

class AddCommentView extends BaseComponent {
  constructor(props) {
      super(props);
      this.state = {
          comment: '',
          selectedImage :null,
          createdcommentId :'',
      };
  }
  componentDidMount() {
      super.componentDidMount();
    }
  componentWillReceiveProps(nextProps) {
       if(nextProps.commentCreatedRequestStarted) {
         if (!nextProps.commentCreated && nextProps.commentCreationErrorMessage) {
           Alert.alert( null, nextProps.commentCreationErrorMessage,null)
         }else if(nextProps.commentCreated){
            this.onDismiss()
         } else if(nextProps.commentUploadImageFailed) {
           Alert.alert( null, nextProps.commentUploadImageFailed,this.onDismiss)
        }
     }
   }

   componentWillUnmount(){
       //dismissKeyboard();
   }


   selectcommentImage() {
      const options = {
        title: 'Photo Picker',
        quality: 1,
        cancelButtonTitle: 'Cancel',
 takePhotoButtonTitle: 'Take Photo...', // specify null or empty string to remove this button
 chooseFromLibraryButtonTitle: 'Choose from Library...',
        maxWidth: 1000,
        maxHeight: 1000,
        storageOptions: {
          skipBackup: true
        }
    };

    ImagePickerManager.showImagePicker(options, (response) => {
      if (response.didCancel) {
      } else if (response.error) {      }else if (response.customButton) {
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

  onCreatecommentRequest() {
    dismissKeyboard();

    if(this.state.comment.trim() == '') {
       return;
        Alert.alert(null,'Please enter Comment',null);
    }

    if(this.state.selectedImage == null) {
      this.props.trialActions.createComment(this.state.comment, this.props.trialSelected.id, null);
    }else {
      this.props.trialActions.createComment(this.state.comment, this.props.trialSelected.id, this.state.selectedImage.uri);
    }
  }

  onDismiss() {
    dismissKeyboard();
    Actions.pop();
  }

  onCommentFocus(e) {
    this.refs.scrollView.scrollToFocusedInput(e, React.findNodeHandle(this.refs.comment), 10);
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
                            <Text style={AppStyles.navBarButtonLabel}>Cancel</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={AppStyles.navBarTitleContainer}>
                <Text style={AppStyles.navBarTitle}>NEW COMMENT</Text>
            </View>
            <View style={{flex: 0.3}}>
                <TouchableOpacity style={[AppStyles.navButtonContainer,{flex:1}]} onPress={this.onCreatecommentRequest.bind(this)} ref ="donebutton">
                    <View style={[AppStyles.navButtonContainer,{paddingRight:10,flex:1,justifyContent:'flex-end'}]}>
                        <View style={AppStyles.navButtonLabelContainer}>
                            <Text style={AppStyles.navBarButtonLabel}>Post</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
         </View>
         <View style={{height :1, backgroundColor : '#D8D8D6'}}>
         </View>

         <KeyboardAwareScrollView style = {styles.container} ref="scrollView" automaticallyAdjustContentInsets={false} >
            <View>
                <TouchableOpacity onPress={this.selectcommentImage.bind(this)}>
                      <View style={styles.imageContainer}>
                            <View style={{flex : 0}}>
                            { this.state.selectedImage === null ? <Text style={{height :0,width :0}}></Text> :
                            <Image style={styles.commentImageStyle} source={this.state.selectedImage} resizeMode={Image.resizeMode.contain}/>
                            }
                           <TouchableOpacity style = {styles.cameraButton} onPress={this.selectcommentImage.bind(this)}>
                             <Image source={require('image!camera_image')}/>
                           </TouchableOpacity>
                          </View>
                      </View>
                </TouchableOpacity>
                <TextInput
                      style={[AppStyles.textFieldStyle, {height: 220, marginTop:10}]}
                      ref="comment"
                      placeholder="Comments..."
                      placeholderTextColor="#CCCCCC"
                      autoCorrect={false}
                      clearButtonMode="always"
                      onChangeText={(comment) => this.setState({comment})}
                      multiline={true}
                      returnKeyType="default"
                      selectTextOnFocus
                      enablesReturnKeyAutomatically
                      keyboardAppearance="light"
                      autoCapitalize="sentences"
                      onFocus={this.onCommentFocus.bind(this)}
                      maxLength={250}
                      />
            </View>
          </KeyboardAwareScrollView>
        </View>
      )
    }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F1EF',
    paddingLeft :20,
    paddingRight : 20,
  },
  cameraButton: {
    alignSelf : 'flex-end',
    marginTop :17,
    marginRight : 20
  },
  cameraImage: {
    width:25,
    height:23,
    tintColor: '#1f7ef6'
  },
  imageContainer: {
    height : width-40,
    backgroundColor: '#FFFFFF',
    marginTop: 26,
    borderRadius :3
  },
  commentImageStyle: {
    flex: 0,
    top:0,
    left:0,
    position : 'absolute',
    height : width-40,
    width :width-40,
    borderRadius:5
  },
  commentBox: {
    borderRadius: 3,
    marginTop: 15
  },
  commentTextStyle: {
    height: 220,
    padding:15,
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
    fontSize : 15
  }

});


const mapStateToProps = (state) => ({
    "commentCreatedRequestStarted": state.trial.commentCreatedRequestStarted,
    "commentCreated": state.trial.commentCreated,
    "commentCreationErrorMessage": state.trial.commentCreationError,
    "commentResponse": state.trial.commentResponse,
    "trialSelected": state.trial.trialSelected,
    "commentUploadImageFailed": state.trial.commentUploadImageFailed,
});

const mapDispatchToProps = (dispatch) => ({
    'trialActions': bindActionCreators(trialActionCreator, dispatch)
});


export default connect(mapStateToProps, mapDispatchToProps)(AddCommentView);
