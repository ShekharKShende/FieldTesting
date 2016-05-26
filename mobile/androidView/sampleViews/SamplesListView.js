

/* ==============================
  Initialise Component
  =============================== */
// React
var React = require('react-native');

// App Globals
var AppStyles = require('../styles.ios');
import {Actions} from 'react-native-router-flux'
import config from 'common/config';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as samplesCreator from 'common/actions/samples';
import {SegmentedControls} from 'react-native-radio-buttons';
import CacheImage from 'common/imagecache/index.js';
import {getFormattedDate} from 'common/util';

var {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Component,
  ListView,
  ToolbarAndroid,
  Image,
  TouchableHighlight,


} = React;
 var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
/* ==============================
  View
  =============================== */
class SamplesListView extends React.Component{

  static contextTypes = {drawer: React.PropTypes.object}


constructor(props){
       super(props);

       this.state={
           sampleListResponse :'',
           rowIDs:[],
           loaded: false,
           value: 'Checked Out',
           dataSource: ds.cloneWithRows([]),
           lastRow : -1,

       }
   }

componentDidMount() {
  this.getSampleList("Unavailable","activeTrialStartDate,desc");
}

componentWillReceiveProps(nextProps) {
  	if(nextProps.sampleListRequestCompleted || nextProps.sampleCreated|| nextProps.sampleUpdateCompleted|| nextProps.sampleDeleteRequestResponse) {
    this.setState({dataSource: ds.cloneWithRows(this.prepareListData(nextProps.sampleListRequestResponse,this.state.value))});
        if(nextProps.sampleCreated && this.state.value == "Checked Out") {
           this.getSampleList("Available","id,desc");
           this.state={value: 'Available'}
        }
    }
    if(nextProps.sampleCheckedIn){
     this.props.sampleActions.sampleCheckedIn();
     this.getSampleList("Unavailable","activeTrialStartDate,desc");
   }

  //  if(nextProps.sampleUpdateCompleted) {
  //    this.props.sampleActions.getSamples("All", 0, config.MAX_LIMIT, "id", "ASC");
  //  }
}

prepareListData(sampleListResponse,selectedSample) {
  var sampleMap = [];
  if(sampleListResponse) {
    if(selectedSample=="Checked Out") {
      var rowID = 0;
      for(var i =0;i<sampleListResponse.content.length;i++) {
        var contentsItem = sampleListResponse.content[i];
        if(!contentsItem.available) {
          sampleMap.push(contentsItem);
          this.setState({
             lastRow:rowID
          });
          rowID+=1;
        }
      }
    } else {
      var rowID = 0;
      for(var i =0;i<sampleListResponse.content.length;i++) {
        var contentsItem = sampleListResponse.content[i];
        if(contentsItem.available) {
          sampleMap.push(contentsItem);
            this.setState({
               lastRow:rowID
            });
            rowID+=1;
        }
      }
    }
}
  return sampleMap
}

  checkoutSample(sampleId){
    this.props.sampleActions.setSelectedSampleId(sampleId);
    Actions.SelectTester();
  }

  checkinSampleConfirm(sampleId, trialId){
    Alert.alert( 'Check in', 'Are you sure you want to check in this item ?',
     [
       {text: 'CANCEL'},
      {text: 'OK', onPress: () => this.checkinSample(sampleId, trialId)}
     ]
    )
    // AlertIOS.alert('Check in', 'Are you sure you want to check in this item ?', [{text: 'Cancel'}, {text: 'OK', onPress: () => this.checkinSample(sampleId, trialId)}]);
  }

  checkinSample(sampleId, trialId){
    this.props.sampleActions.checkinSample(sampleId, trialId);
  }


 rowPressed(row) {
   this.props.sampleActions.onSelectSample(row);
   Actions.SampleDetails();

 }


renderRow(sampleRow) {
  return (
  <TouchableHighlight key = {sampleRow.id+''} onPress={() => this.rowPressed(sampleRow)}>
    <View style={styles.listcontainer} key = {sampleRow.id+''}>
         {sampleRow.images[0].imageUrl != null ?
           <CacheImage
             resizeMode='contain'
             url={sampleRow.images[0].imageUrl}
             style={AppStyles.listThumbnailStyle}
             cacheId={'sample' + sampleRow.id}
             defaultImage={require('image!default_image')}
             modifieddate = {sampleRow.modificationDateTime}
           />
            :
        <View  style={[AppStyles.listThumbnailStyle, {backgroundColor:'#b7bbbc'}]}></View>}

        <View style = {styles.listTextcontainer}>
            <View style = {styles.listheadercontainer}>
                  <Text style={[AppStyles.itemTitleStyle,{width:165,alignSelf:'flex-start'}]}>{sampleRow.name}</Text>
                  { !sampleRow.available?  <Text style = {[AppStyles.statusTitleStyle, {marginRight:12}]}>Unavailable</Text>:
                      <Text style = {[AppStyles.statusTitleStyle, {marginRight:12}]}>Available</Text>}
            </View>
            <Text style = {AppStyles.statusTitleStyle}>{sampleRow.code}</Text>
            { !sampleRow.available ?  <TouchableOpacity style={[AppStyles.checkInButton,{marginTop:2}]} key={sampleRow.id} onPress={()=>this.checkinSampleConfirm(sampleRow.id, sampleRow.activeTrial.id)}>
                <Text style = {AppStyles.checkInButtonTextStyle}>Check In</Text>
            </TouchableOpacity>:
            <TouchableOpacity style={[AppStyles.checkOutButton,{marginTop:2}]} onPress={()=>this.checkoutSample(sampleRow.id)} key={sampleRow.id}>
                <Text style = {AppStyles.checkOutButtonTextStyle}>Check Out</Text>
            </TouchableOpacity>}
            { !sampleRow.available?<Text style = {[AppStyles.listTesterNameTextStyle,{marginTop:5,marginBottom:11}]}>{sampleRow.activeTrial.fieldTester.firstName+" "+sampleRow.activeTrial.fieldTester.lastName+" "+getFormattedDate(sampleRow.activeTrial.startDate)} </Text>: <Text></Text>}
      </View>
	  </View>
  </TouchableHighlight>
      );
    }

renderSeparator(sectionData,rowID, adjacentRowHighlighted) {
  if(rowID != this.state.lastRow) {
    return (
      <View style={styles.separator} key={rowID+""+sectionData}>
        <View style={styles.leftSeparator} ></View>
         <View style={styles.rightSeparator} ></View>
      </View>
    )
  } else {
    return (
      <View  key={rowID+""+sectionData}/>
    )
  }
}

getSampleList(status, sort) {
  	this.props.sampleActions.getSamples(status, config.MAX_RECORD_IN_PAGE, config.MAX_LIMIT, sort);
}

 render() {
   var toggle=this.context.drawer.toggle;
    return (
      <View style={styles.container}>
      <ToolbarAndroid
       navIcon={require('image!hamburger')}
       title="SAMPLES"
       titleColor='#999a9e'
       actions={[{title: 'Add', icon: require('image!add'), show: 'always'}]}
         onIconClicked={toggle.bind(this)}
       style={styles.toolbar}/>
          <View style = {{marginTop:2,marginLeft:1}}>
        <SegmentedControls
            tint= {'#1f7ef6'}
            selectedTint= {'white'}
            backTint= {'white'}
            optionStyle= {{
              fontSize: 13,
              fontWeight: '500',
              fontFamily: 'Helvetica Neue'
            }}
            containerStyle= {{
              marginLeft: 15,
              marginRight: 15,
              marginTop:10,
              marginBottom:10,
            }}
            containerBorderRadius={4}
            options={ ["Checked Out","Available"]}
            onSelection={this. onSegmentValueChange.bind(this) }
            selectedOption={ this.state.value }
            />
        </View>
          <ListView
            dataSource={this.state.dataSource}
            renderRow={this.renderRow.bind(this)}
            enableEmptySections
            renderSeparator = {this.renderSeparator.bind(this)}
            style={styles.listView}/>

      </View>
    );
  }

 onSegmentValueChange(sampleSelected) {
       this.setState({
         value: sampleSelected,
       });

      if(sampleSelected == "Checked Out"){
        this.getSampleList("Unavailable","activeTrialStartDate,desc");
      } else {
        this.getSampleList("Available","id,desc");
      }
}
}

var styles = StyleSheet.create({

container: {
  flex:1,
  backgroundColor: '#F1F1EF',
},
listView: {
  marginTop:0,

},
listcontainer: {
  flex:0,
  backgroundColor: '#FFFFFF',
  flexDirection:'row',
  alignItems: 'center',
  paddingRight: 12,
  paddingLeft: 12,
  paddingTop: 15,
  paddingBottom: 15,
},
listheadercontainer: {
  flex:1,
  backgroundColor: '#FFFFFF',
  flexDirection:'row',
  justifyContent:'space-between'
},
listTextcontainer: {
  flex:1,
  backgroundColor: '#FFFFFF',
  marginLeft :12
},

checkInButton : {
  backgroundColor :'#FFFFFF',
  borderRadius : 3,
  borderWidth : 1,
  borderColor :'#3977B9',
  height : 28,
  width :110,
  marginTop:2,
  alignItems:'center',
  justifyContent:'center'
},
checkOutButton : {
  backgroundColor :'#3977B9',
  borderRadius : 3,
  borderWidth : 1,
  borderColor :'#3977B9',
  height : 28,
  width :110,
  marginTop:2,
  alignItems:'center',
  justifyContent:'center'
},
checkInButtonTextStyle : {
  color : '#3977B9',
  fontSize : 12
},
checkOutButtonTextStyle : {
  color : '#FFFFFF',
  fontSize : 12
},
testerNameTextStyle : {
  color : '#FC0D1B',
  fontSize : 14,
  marginTop:4,
  fontWeight:'bold',
  marginBottom:18
},
separator: {
  flex :0,
  flexDirection : 'row',
  backgroundColor : '#ADB4BA'
},
leftSeparator: {
  height: 1,
  width:80,
  backgroundColor : '#FFFFFF'
},
rightSeparator: {
  height: 1,
  backgroundColor : '#ADB4BA'
},
toolbar: {
   backgroundColor: '#e9eaed',
    height: 56,
   }
});

const mapStateToProps = (state) => ({
      "sampleListRequestStarted": state.sample.sampleListRequestStarted,
      "sampleListRequestFailed": state.sample.sampleListRequestFailed,
      "sampleListRequestResponse": state.sample.sampleListRequestResponse,
      "sampleListRequestCompleted":state.sample.sampleListRequestCompleted,
      "sampleCreated":state.sample.sampleCreated,
      "sampleCheckedIn":state.sample.sampleCheckedIn,
      "sampleUpdateCompleted":state.sample.sampleUpdateCompleted,
      'isNetworkStatus': state.app.isNetworkStatus,
      "sampleDeleteRequestResponse":state.sample.sampleDeleteRequestResponse,
});

const mapDispatchToProps = (dispatch) => ({
    'sampleActions': bindActionCreators(samplesCreator, dispatch)
});


export default connect(mapStateToProps, mapDispatchToProps)(SamplesListView);
