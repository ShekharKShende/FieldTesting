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
    Image,
    Alert
} from 'react-native';
import {Actions} from 'react-native-router-flux'
import config from 'common/config';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as samplesCreator from 'common/actions/samples';
var {width, height} = require('Dimensions').get('window');
import CacheImage from 'common/imagecache/index.js';
var AppStyles = require('../styles.ios');
import {getFormattedDate} from 'common/util';
import BaseComponent from '.././BaseComponent'

class SampleDetailsView extends BaseComponent{
  constructor(props){
         super(props);
         this.state = {};
     }

  componentWillMount() {
   this.getSamplesDetailHistory();
  }
  componentDidMount()
  {
    super.componentDidMount();
  }

  getSamplesDetailHistory() {
  //  page,size, sort,sampleId
   this.props.sampleActions.getSamplesDetailHistory(config.MAX_LIMIT, config.MAX_RECORD_IN_PAGE, "id,DESC",this.props.selectedSample.id);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.sampleCheckedInFromDetail || nextProps.sampleCheckedOutFromDetail) {
      this.getSamplesDetailHistory();
    }
    if(nextProps.sampleDeleteRequestResponse) {
      Actions.pop();
    }

  }

  onEditSample() {
   Actions.CreateSample();
   this.props.sampleActions.onEditSample();
  }

  checkoutSample(sampleId){
    this.props.sampleActions.setSelectedSampleId(sampleId);
    Actions.SelectTester();
  }

  checkinSampleConfirm(sampleId, trialId){
    Alert.alert('Check in', 'Are you sure you want to check in this item ?', [{text: 'Cancel'}, {text: 'OK', onPress: () => this.checkinSample(sampleId, trialId)}]);
  }

  checkinSample(sampleId, trialId){
    this.props.sampleActions.checkinSample(sampleId, trialId);
  }



  renderTesterView() {
   if(this.props.sampleDetailHistoryRequestResponse) {
       var returnValue =[];
       var contents = this.props.sampleDetailHistoryRequestResponse.content;
       for(var i = 0; i<contents.length; i++) {
         var contentsItem = contents[i];
         var marginTop = 10;
         //this is temp hack, we are getting extra 10 margin for first item
         if(i == 0 && contentsItem.feedbacks.length == 0 && !this.props.selectedSample.available) {
           marginTop = 0;
         }
         returnValue.push(
              <View key = {contentsItem.id} style={{flex: 0, flexDirection:'column', backgroundColor:'#FFFFFF', marginTop:marginTop}}>
                  {contentsItem.status != 'Active'?
                    <View style={{flexDirection:'column'}}>
                        <View style = {AppStyles.checkInHeaderContainer}>
                            <Text style = {[AppStyles.checkOutInBannerTextStyle,{marginLeft :10,alignSelf:"flex-start"}]}> {contentsItem.fieldTester.firstName +" "
                              +contentsItem.fieldTester.lastName}
                            </Text>
                            <View style = {[styles.checkOutInChildHeaderContainer]}>
                              <Text style = {[AppStyles.checkOutInBannerTextStyle,{marginRight :10}]}> Checked In
                              </Text>
                              <Text style = {[AppStyles.checkOutInBannerTextDateStyle,{marginRight :10}]}> {getFormattedDate(contentsItem.endDate)}
                              </Text>
                          </View>
                        </View>
                        <View style={{height :10, backgroundColor : '#F1F1EF'}}></View>
                     </View>:<View style={{height :0, backgroundColor : '#D8D8D6'}}></View>
                  }
                    {this.renderFeedBackView(contentsItem)}
                  {contentsItem.status == 'Completed' || contentsItem.status == 'Active'?
                    <View style={{flexDirection:'column'}}>
                       {contentsItem.feedbacks.length > 0 || (contentsItem.feedbacks.length == 0 && i == 0 && contentsItem.status == 'Active') ? <View style={{height :10, backgroundColor : '#F1F1EF'}}></View> : <View/>}
                        <View style = {AppStyles.checkOutHeaderContainer}>
                            <Text style = {[AppStyles.checkOutInBannerTextStyle,{marginLeft :10,alignSelf:"flex-start"}]}> {contentsItem.fieldTester.firstName +" "
                              +contentsItem.fieldTester.lastName}
                            </Text>
                            <View style = {[styles.checkOutInChildHeaderContainer]}>
                                <Text style = {[AppStyles.checkOutInBannerTextStyle,{marginRight :10}]}> Checked Out
                                </Text>
                                <Text style = {[AppStyles.checkOutInBannerTextDateStyle,{marginRight :10}]}> {getFormattedDate(contentsItem.startDate)}
                                </Text>
                            </View>
                        </View>
                   </View>:<View style={{height :0, backgroundColor : '#D8D8D6'}}></View>
                  }
            </View>
            );

       }

      return returnValue;
      } else{
            return (
              <View/>
          );
      }
  }


renderFeedBackView(contentsItem) {
 var feedbacks = contentsItem.feedbacks;
 if(feedbacks.length>0) {
 var returnFeedbackView =[];
 for (var j = feedbacks.length - 1; j >= 0; j--) {
    var feed = feedbacks[j];
      returnFeedbackView.push(
          <View style={{flex:0,flexDirection:'column'}} key = {contentsItem.id+feed.id+''}>
          <View style={{flex: 1, flexDirection:'row'}}>
              <View style = {[AppStyles.roundBlankImage,{alignSelf:"center",marginLeft:18, marginRight:22, marginTop:10, marginBottom:10}]}></View>
                <View style={{flex: 1,paddingRight : 22,alignSelf:'center'}}>
                  <Text style={[AppStyles.itemTitleStyle]}>{contentsItem.fieldTester.firstName +" "+contentsItem.fieldTester.lastName}</Text>
                  <Text style={[AppStyles.statusTitleStyle,{marginTop:2}]}>{getFormattedDate(feed.creationDate)}</Text>
                </View>
          </View>

          <View style={{flex:0, flexDirection:'column', backgroundColor:'#FFFFFF', justifyContent:'center'}}>
          {feed.image != null ?
            <CacheImage
              resizeMode='contain'
              url={feed.image}
              style ={{height:width, width:width}}
              cacheId={'feedback' + feed.id}
              defaultImage={require('common/images/default_image.png')}
              modifieddate = {feed.modificationDateTime}
            />
            :
            <View/>
          }
          </View>
          <Image source={require('common/images/speech_bubble.png')}
                 style ={{height:25, width:27, marginLeft:20, marginTop:20}}/>
               <View style={{height :1, backgroundColor : '#ADB4BA',marginLeft:20, marginTop:10, marginRight:20, marginBottom:10}}></View>

          <View style={{flexDirection:'column',marginLeft:20, marginRight:20,marginBottom:20}}>
                <View style={{flex:1,flexDirection:'row',justifyContent:'space-between'}}>
                  <Text style={[AppStyles.itemTitleStyle,{width:160}]}>{contentsItem.fieldTester.firstName +" "+contentsItem.fieldTester.lastName}</Text>
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

 onPop() {
   Actions.pop();
 }

 componentWillUnmount(){
   this.props.sampleActions.onSampleDetailFinished();
 }

 render() {
   console.log("this.props.selectedSample"+JSON.stringify(this.props.selectedSample));
    return(
    <View style={{flex : 1}}>
          <View style={AppStyles.customNavBar}>
                          <View style={{flex: 0.3}}>
                              <TouchableOpacity style={[AppStyles.navButtonContainer,{flex:1}]}
                                                onPress={this.onPop.bind(this)}>
                                  <View style={[AppStyles.navButtonContainer,{flex:1}]}>
                                      <View style={AppStyles.navButtonLabelContainer} >
                                          <Image source={require('image!back')}/>
                                      </View>
                                  </View>
                              </TouchableOpacity>
                          </View>
                          <View style={AppStyles.navBarTitleContainer}>
                              <Text style={[AppStyles.navBarTitle, {width:200}]} numberOfLines={1}>{this.props.selectedSample.name}</Text>
                          </View>
                          <View style={{flex: 0.3}}>
                              <TouchableOpacity style={[AppStyles.navButtonContainer,{flex:1}]} ref ="editbutton" onPress={this.onEditSample.bind(this)}>
                                  <View style={[AppStyles.navButtonContainer,{paddingRight:10,flex:1,justifyContent:'flex-end'}]}>
                                      <View style={AppStyles.navButtonLabelContainer}>
                                          <Text style={AppStyles.navBarButtonLabel}>Edit</Text>
                                      </View>
                                  </View>
                              </TouchableOpacity>
                          </View>
        </View>
         <View style={{height :1, backgroundColor : '#D8D8D6'}}>
         </View>

        <View style = {styles.container}>
          {!this.props.selectedSample.available?
            <View style = {AppStyles.checkOutHeaderContainer}>
                <Text style = {[AppStyles.checkOutInBannerTextStyle,{marginLeft :10,alignSelf:"flex-start"}]}> {this.props.selectedSample.activeTrial.fieldTester.firstName +" "
                  +this.props.selectedSample.activeTrial.fieldTester.lastName}
                </Text>
                <View style = {[styles.checkOutInChildHeaderContainer]}>
                    <Text style = {[AppStyles.checkOutInBannerTextStyle,{marginRight :10}]}> Checked Out
                    </Text>
                    <Text style = {[AppStyles.checkOutInBannerTextDateStyle,{marginRight :10}]}> {getFormattedDate(this.props.selectedSample.activeTrial.startDate)}
                    </Text>
                </View>
            </View>
            :<View style={{height :0, backgroundColor : '#D8D8D6'}}></View>
          }
          <ScrollView>
               <View style= {styles.scrollViewcontainer}>
                 {this.props.selectedSample.images[0].imageUrl != null ?
                   <CacheImage
                     resizeMode='contain'
                     url={this.props.selectedSample.images[0].imageUrl}
                     style = {styles.imageStyle}
                     cacheId={'sample' + this.props.selectedSample.id}
                     defaultImage={require('image!default_image')}
                     modifieddate = {this.props.selectedSample.modificationDateTime}
                   />
                 :
                 <View style = {styles.imageStyleDefault}></View>}
                   <View style = {{flexDirection:'row', justifyContent:'space-between'}}>
                         <View style = {{flex : 0, flexDirection:'column', marginLeft:0}}>
                              <Text style={[AppStyles.itemTitleStyle,{textAlign:'left',width:180}]} numberOfLines={5}>{this.props.selectedSample.name}
                              </Text>
                              <Text style={[AppStyles.statusTitleStyle,{marginTop:1}]}>{this.props.selectedSample.code}
                              </Text>
                         </View>
                        {this.props.selectedSample.available?
                         <TouchableOpacity style={AppStyles.checkOutButton} onPress={()=>this.checkoutSample(this.props.selectedSample.id)}>
                             <Text style = {AppStyles.checkOutButtonTextStyle}>Check Out</Text>
                         </TouchableOpacity> : <TouchableOpacity style={AppStyles.checkInButton} onPress={()=>this.checkinSampleConfirm(this.props.selectedSample.id, this.props.selectedSample.activeTrial.id)}>
                             <Text style = {AppStyles.checkInButtonTextStyle}>Check In</Text>
                         </TouchableOpacity>}
                   </View>
                  <Text style={[AppStyles.commentsText,{marginTop:10}]}>
                  {this.props.selectedSample.description}
                  </Text>
               </View>
              <View style={{height :1, backgroundColor : '#D8D8D6'}}></View>
              <View>
                  {this.renderTesterView(this)}
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
  height :320,
  marginBottom :20,
  backgroundColor:'#ADB4BA'
},
checkOutInChildHeaderContainer: {
  flex : 0,
  alignItems: 'flex-end'
}

});

const mapStateToProps = (state) => ({
    "selectedSample" : state.sample.selectedSample,
    "sampleDetailHistoryRequest" : state.sample.sampleDetailHistoryRequest,
    "sampleDetailHistorySuccessful":state.sample.sampleDetailHistorySuccessful,
    "sampleDetailHistoryRequestFaileds":state.sample.sampleDetailHistoryRequestFailed,
    "sampleDetailHistoryRequestResponse":state.sample.sampleDetailHistoryRequestResponse,
    "sampleCheckedIn":state.sample.sampleCheckedIn,
    "sampleCheckedInFromDetail":state.sample.sampleCheckedInFromDetail,
    "sampleCheckedOutFromDetail":state.sample.sampleCheckedOutFromDetail,
    "sampleDeleteRequestResponse":state.sample.sampleDeleteRequestResponse,
});

const mapDispatchToProps = (dispatch) => ({
    'sampleActions': bindActionCreators(samplesCreator, dispatch)
});


export default connect(mapStateToProps, mapDispatchToProps)(SampleDetailsView);
