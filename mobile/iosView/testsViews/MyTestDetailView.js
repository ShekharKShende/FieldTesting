/**
 * Created by synerzip on 11/03/16.
 */
import React, {
    AppRegistry,
    Component,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    Image
} from 'react-native';
import {Actions} from 'react-native-router-flux'
import config from 'common/config';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as trialActionCreator from 'common/actions/trials';
var {width, height} = require('Dimensions').get('window');
import {getCommentFilePath, isFileExist, loadFromLocalStorage} from 'common/util';
import CacheImage from 'common/imagecache/index.js';
var AppStyles = require('../styles.ios');
var underScore = require('underscore');
import {getFormattedDate} from 'common/util';

class MyTestDetailView extends React.Component {
  constructor(props){
         super(props);
         this.state = {
           localStoredComments: []
         }
     }

  componentWillMount() {
     //this.getSamplesDetailHistory();
     this.getLocalStoredComments(this);
  }

  getLocalStoredComments(self) {
    loadFromLocalStorage(config.OFFLINECOMMENTLIST).then( commentList => {
      console.log('Trial List from local');
      console.log(commentList);
      var filteredList = underScore.where(commentList, {trialId: self.props.trialSelected.id});
      if(filteredList.length > 0) {
        self.setState({localStoredComments: filteredList})
      }
    }).catch(error => {
      console.log("Sync filter error : ");
      console.log(error);
      self.setState({localStoredComments : []})
    })
  }

  getSamplesDetailHistory() {
   //this.props.sampleActions.getSamplesDetailHistory(0, config.MAX_LIMIT, "id", "DESC",this.props.trialSelected.id);
  }

  componentWillReceiveProps(nextProps) {
      console.log("Received props");
  }

  componentWillUnmount(){

  }

  commentPressed() {
      this.props.trialActions.selectTrial(this.props.trialSelected);
      Actions.AddComment();
  }

 renderTesterView() {

       var returnValue =[];
         returnValue.push(
              <View  style={{flex: 0, flexDirection:'column', backgroundColor:'#FFFFFF',marginTop:10}} key={this.props.trialSelected.id+""+this.props.trialSelected.startDate}>
                  {this.props.trialSelected.status == 'Completed'?
                    <View style={{flexDirection:'column'}}>
                        <View style = {AppStyles.checkInHeaderContainer}>
                            <Text style = {[AppStyles.checkOutInBannerTextStyle,{marginLeft :10,alignSelf:"flex-start"}]}> {this.props.trialSelected.fieldTester.firstName +" "
                              +this.props.trialSelected.fieldTester.lastName}
                            </Text>
                            <View style = {styles.checkOutInChildHeaderContainer}>
                              <Text style = {[AppStyles.checkOutInBannerTextStyle,{marginRight :10}]}> {getFormattedDate(this.props.trialSelected.endDate)}
                              </Text>
                            <Text style = {[AppStyles.checkOutInBannerTextStyle,{marginRight :10}]}> Checked In
                            </Text>
                          </View>
                        </View>
                        <View style={{height :10, backgroundColor : '#F1F1EF'}}></View>
                     </View>:<View style={{height :0, backgroundColor : '#D8D8D6'}}></View>
                  }
                    {this.renderFeedBackView()}

                    <View style={{flexDirection:'column', marginBottom:10}}>
                       {this.props.trialSelected.feedbacks.length > 0 ? <View style={{height :10, backgroundColor : '#F1F1EF'}}></View> : <View/>}

                        <View style = {AppStyles.checkOutHeaderContainer}>
                            <Text style = {[AppStyles.checkOutInBannerTextStyle,{marginLeft :10,alignSelf:"flex-start"}]}> {this.props.trialSelected.fieldTester.firstName +" "
                              +this.props.trialSelected.fieldTester.lastName}
                            </Text>
                            <View style = {styles.checkOutInChildHeaderContainer}>
                                <Text style = {[AppStyles.checkOutInBannerTextStyle,{marginRight :10}]}> Checked Out
                                </Text>
                                <Text style = {[AppStyles.checkOutInBannerTextDateStyle,{marginRight :10}]}> {getFormattedDate(this.props.trialSelected.startDate)}
                                </Text>
                            </View>
                        </View>
                   </View>
            </View>
            );

      return returnValue;
      }

      //To Remove duplicate comments added on the fly at creation time of comment.
      removeDuplicateFeedbackComment(arr) {
          var arrResult = {},
          nonDuplicatedArray = [];
          for (var i = 0, n = arr.length; i < n; i++) {
             var item = arr[i];
             arrResult[item.id + " - " + item.creationDate] = item;
           }
           console.log(arrResult);
           i = 0;
           for (var item in arrResult) {
             nonDuplicatedArray[i++] = arrResult[item];
           }
           return nonDuplicatedArray;
      }

     renderFeedBackView() {
        var feedbacks = this.props.trialSelected.feedbacks;
        if(feedbacks == null && this.state.localStoredComments.length > 0) {
          feedbacks = this.state.localStoredComments;
        }else {
          feedbacks = feedbacks.concat(this.state.localStoredComments);
          feedbacks = this.removeDuplicateFeedbackComment(feedbacks)
        }
        if(feedbacks.length>0) {
        var returnFeedbackView =[];
         for (var j = feedbacks.length - 1; j >= 0; j--) {
          var feed = feedbacks[j];
          var feedImageUrl = feed.image;
          if(feed.image && feed.isSync && feed.isSync == true) {
              feedImageUrl = "file://" + getCommentFilePath(feedImageUrl);
              if(isFileExist(feedImageUrl) == false) {
                  feedImageUrl = null;
                  feed.image = null;
              }
          }
            returnFeedbackView.push(
                <View style={{flex:0,flexDirection:'column'}} key = {feed.id+''}>
                    <View style={{flex: 1, flexDirection:'row'}}>
                        <View style = {[AppStyles.roundBlankImage,{marginLeft:18, marginRight:22, marginTop:10, marginBottom:10}]}></View>
                        <View style={{flex: 1,paddingRight : 22,alignSelf:'center'}}>
                          <Text style={[AppStyles.itemTitleStyle]}>{this.props.trialSelected.fieldTester.firstName +" "+this.props.trialSelected.fieldTester.lastName}</Text>
                          <Text style={[AppStyles.statusTitleStyle]}>{getFormattedDate(feed.creationDate)}</Text>
                        </View>
                    </View>

                    <View style={{flex:0, flexDirection:'column', backgroundColor:'#FFFFFF', justifyContent:'center'}}>
                    {feed.image != null ?
                        <CacheImage
                          resizeMode='contain'
                          url={feedImageUrl}
                          style ={{height:width, width:width}}
                          cacheId={'feedback' + feed.id}
                          defaultImage={require('common/images/default_image.png')}
                          modifieddate = {feed.modificationDateTime}
                        />
                      :
                      <View />
                      }

                    </View>
                    <Image source={require('common/images/speech_bubble.png')}
                           style ={{height:25, width:27, marginLeft:20, marginTop:20}}/>
                         <View style={{height :1, backgroundColor : '#ADB4BA',marginLeft:20, marginTop:10, marginRight:20, marginBottom:10}}></View>

                    <View style={{flexDirection:'column',marginLeft:20, marginRight:20,marginBottom:20}}>
                          <View style={{flex:1,flexDirection:'row',justifyContent:'space-between'}}>
                            <Text style={[AppStyles.itemTitleStyle,{width:160}]}>{this.props.trialSelected.fieldTester.firstName +" "+this.props.trialSelected.fieldTester.lastName}</Text>
                            <Text style={AppStyles.statusTitleStyle}>{getFormattedDate(feed.creationDate)}</Text>
                          </View>
                          <Text style={[AppStyles.commentsText,{marginTop:10}]}>{feed.comments}
                          </Text>
                    </View>

                    {feedbacks.length > 1 && j != 0 ? <View style={{height :10, backgroundColor : '#F1F1EF'}}></View> :<View/>}

                </View>
            );
         }
           return returnFeedbackView;
         } else {
             return (
               <View/>
           );
         }
   }


 render() {
    return(
    <View style={{flex : 1}}>
          <View style={AppStyles.customNavBar}>
                          <View style={{flex: 0.3}}>
                              <TouchableOpacity style={[AppStyles.navButtonContainer,{flex:1}]}
                                                onPress={()=>Actions.pop()}>
                                  <View style={[AppStyles.navButtonContainer,{flex:1}]}>
                                      <View style={AppStyles.navButtonLabelContainer} >
                                          <Text style={AppStyles.navBarButtonLabel}>Back</Text>
                                      </View>
                                  </View>
                              </TouchableOpacity>
                          </View>
                          <View style={AppStyles.navBarTitleContainer}>
                              <Text style={[AppStyles.navBarTitle, {width:200}]}  numberOfLines={1}>{this.props.trialSelected.sample.name}</Text>
                          </View>
                          <View style={{flex: 0.3}}>
                              <TouchableOpacity style={[AppStyles.navButtonContainer,{flex:1}]}  ref ="donebutton">
                                  <View style={[AppStyles.navButtonContainer,{paddingRight:10,flex:1,justifyContent:'flex-end'}]}>
                                      <View style={AppStyles.navButtonLabelContainer}>
                                          <Text style={AppStyles.navBarButtonLabel}></Text>
                                      </View>
                                  </View>
                              </TouchableOpacity>
                          </View>
                      </View>
         <View style={{height :1, backgroundColor : '#D8D8D6'}}>
         </View>
         <View style = {styles.container}>
                   <ScrollView>
                        <View style= {styles.scrollViewcontainer}>
                          {this.props.trialSelected.sample.image != null?
                            <CacheImage
                              resizeMode='contain'
                              url={this.props.trialSelected.sample.image}
                              style={styles.imageStyle}
                              cacheId={'sample' + this.props.trialSelected.sample.id}
                              defaultImage={require('common/images/default_image.png')}
                              modifieddate = {this.props.trialSelected.sample.modificationDateTime}
                            />
                            :
                          <View style = {styles.imageStyleDefault}></View>}
                            <View style = {{flexDirection:'row', justifyContent:'space-between'}}>
                                  <View style = {{flex : 0, flexDirection:'column', marginLeft:0}}>
                                       <Text style={[AppStyles.itemTitleStyle,{textAlign:'left',width:180}]} numberOfLines={5}>{this.props.trialSelected.sample.name}
                                       </Text>
                                       <Text style={[AppStyles.statusTitleStyle,{marginTop:1}]}>{this.props.trialSelected.sample.code}
                                       </Text>
                                  </View>
                                 {this.props.trialSelected.status == 'Active'?
                                   <TouchableOpacity style={[AppStyles.commentsButton]} onPress= {() => this.commentPressed()}>
                                     <Text style = {AppStyles.checkOutButtonTextStyle}>Comment</Text>
                                   </TouchableOpacity>: <View/>}
                            </View>
                           <Text style={[AppStyles.commentsText,{marginTop:10}]}>
                           {this.props.trialSelected.sample.description}
                           </Text>
                        </View>
                       <View style={{height :1, backgroundColor : '#D8D8D6'}}></View>
                        <View>
                          {this.renderTesterView()}
                       </View>
                  </ScrollView>
                 </View>
               </View>
            );
        }
}

var styles = StyleSheet.create({
container: {
  flex:1,
  backgroundColor: '#F1F1EF',
},
scrollViewcontainer: {
  flex:0,
  backgroundColor: '#FFFFFF',
  padding:20,
  flexDirection:'column'
},
imageStyle: {
  height :width-40,
  marginBottom :20
},
imageStyleDefault: {
  height :width-40,
  marginBottom :20,
  backgroundColor:'#ADB4BA'
},
checkOutInChildHeaderContainer: {
  flex : 0,
  alignItems: 'flex-end'
}

});

const mapStateToProps = (state) => ({
    "trialSelected": state.trial.trialSelected,
    "commentCreated":state.trial.commentCreated,
});

const mapDispatchToProps = (dispatch) => ({
    'trialActions': bindActionCreators(trialActionCreator, dispatch)
});


export default connect(mapStateToProps, mapDispatchToProps)(MyTestDetailView);
