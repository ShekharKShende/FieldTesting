/**
 * Created by synerzip on 11/03/16.
 */
import React, {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Component,
    ListView,
    ToolbarAndroid,
    Image,
    TouchableHighlight
} from 'react-native';
import {Actions} from 'react-native-router-flux'
import config from 'common/config';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as trialsActionCreator from 'common/actions/trials';
import CacheImage from 'common/imagecache/index.js';
import {getCommentFilePath, isFileExist, loadFromLocalStorage} from 'common/util';
import {SegmentedControls} from 'react-native-radio-buttons';
var AppStyles = require('../styles.ios');
var underScore = require('underscore');
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2, sectionHeaderHasChanged : (s1, s2) => s1 !== s2})
//https://staging-cloud.centricsoftware.com/field-testing-service
class MyTestsView extends React.Component {
static contextTypes = {drawer: React.PropTypes.object}
    constructor(props){
        super(props);
        this.state={
          lastRow : -1,
          value: 'Checked Out',
          dataSource: ds.cloneWithRows([]),
        }
    }

    componentDidMount() {
        this.getTrialsList();
    }

    componentWillReceiveProps(nextProps) {
      console.log("componentWillReceivePropsInMyTests");
        if(nextProps.trialListRequestCompleted || nextProps.trialCreated) {
            this.setState({dataSource: ds.cloneWithRows(this.prepareListData(nextProps.trialListRequestResponse,this.state.value))});
        }
        this.context.drawer.toggle;
    }

    prepareListData(trialListResponse, selectedTrialType) {
        var contents = trialListResponse.content;

        var trialMap = []; // Create the blank map
        var rowID = 0;
        if(selectedTrialType == "Checked In") {
          for(var i=0;i<contents.length;i++) {
              var contentsItem = contents[i];
            if(contentsItem.status == 'Completed') {
              trialMap.push(contentsItem);
              this.setState({
                 lastRow:rowID
              });
              rowID++;
            }
          }
      } else if(selectedTrialType == "Checked Out" ) {
          for(var i=0;i<contents.length;i++) {
              var contentsItem = contents[i];
            if(contentsItem.status == 'Active') {
              trialMap.push(contentsItem);
              this.setState({
                 lastRow:rowID
              });
              rowID++;
            }
          }
      }
        return trialMap;
    }

    commentPressed(trialRow) {
        this.props.trialActions.selectTrial(trialRow);
        Actions.AddComment();
    }

    rowPressed(trialRow) {
      this.props.trialActions.selectTrial(trialRow);
      Actions.MyTestDetailView();
    }

    getFormattedDate(date) {
      var startDate = new Date(date).toLocaleDateString();
      var startTime = new Date(date);
        return startDate + " "+startTime.getHours()+":"+startTime.getMinutes();
    }

    renderRow(trialRow) {
      console.log("trialRow.sample.images[0].imageUrl"+trialRow.sample.images[0].imageUrl);
        return (
            <TouchableHighlight key = {trialRow.id+''} onPress={() => this.rowPressed(trialRow)}>
                <View style={styles.listcontainer} key = {trialRow.id+''}>
                    {trialRow.sample.images[0].imageUrl != null ?
                      <CacheImage
                        resizeMode='contain'
                        url={trialRow.sample.images[0].imageUrl}
                        style={AppStyles.listThumbnailStyle}
                        cacheId={'sample' + trialRow.sample.id}
                        defaultImage={require('image!default_image')}
                        modifieddate = {trialRow.sample.modificationDateTime}
                      />
                     : <View style = {[AppStyles.listThumbnailStyle],{backgroundColor:'#b7bbbc'}}></View>
                    }
                    <View style = {styles.listTextcontainer}>
                        <Text style = {AppStyles.itemTitleStyle}>{trialRow.sample.name}</Text>
                        <Text style = {AppStyles.statusTitleStyle}>{trialRow.sample.code}</Text>
                      { (trialRow.status == 'Active') ?
                        <TouchableOpacity style={[AppStyles.commentsButton,{marginTop:2}]}
                          key={trialRow.id} onPress= {() => this.commentPressed(trialRow)}>
                          <Text style = {AppStyles.checkOutButtonTextStyle}>Comment</Text>
                        </TouchableOpacity>
                        :
                        <Text style = {AppStyles.statusTitleStyle}>Checked In {this.getFormattedDate(trialRow.endDate)}</Text>}
                    </View>
                    <View style = {{alignItems: 'flex-end'}}>
                      <Image style = {styles.listarrow} source={require('image!arrow')}/>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }

    renderSectionHeader(sectionData, category) {
        return (
            <View style={AppStyles.listSectionHeaderStyle}>
                <Text style={AppStyles.listsSectionTitle}>{category}</Text>
            </View>
        )
    }

    renderSeparator(sectionData,rowID, adjacentRowHighlighted) {
      if(rowID == this.state.lastRow) {
        return (
            <View key={rowID+""+sectionData}/>
        )
      } else {
        return (
            <View style={styles.separator} key={rowID+""+sectionData}>
                <View style={styles.leftSeparator} ></View>
                <View style={styles.rightSeparator} ></View>
            </View>
        )
    }
  }

    getTrialsList() {
        this.props.trialActions.getTrials("All", config.MAX_RECORD_IN_PAGE, config.MAX_LIMIT, "startDate,desc");
    }

    render() {
      var toggle=this.context.drawer.toggle;

        return (
            <View style={styles.container}>
            <ToolbarAndroid
             navIcon={require('image!hamburger')}
               onIconClicked={toggle.bind(this)}
               title="MY TESTS"
               titleColor='#999a9e'
                actions={[{title: 'Add', icon: require('image!add'), show: 'always'}]}
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
                  containerBorderRadius={14}
                  options={ ["Checked Out","Checked In"]}
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

    onSegmentValueChange(selectedTrialType) {
          this.setState({
            value: selectedTrialType,
          });
          this.setState({dataSource: ds.cloneWithRows(this.prepareListData(this.props.trialListRequestResponse,this.state.value))});
    }
}

const styles = StyleSheet.create({

    container: {
        flex:1,
        backgroundColor: '#F1F1EF',
    },
    listView: {

    },
    listcontainer: {
        flex:1,
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
        marginLeft :12,
    },
    listarrow: {
        alignSelf:'center',
        height: 28,
        width: 22,
        tintColor:'#ADB4BA',
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
    "trialListRequestStarted": state.trial.trialListRequestStarted,
    "trialListRequestFailed": state.trial.trialListRequestFailed,
    "trialListRequestResponse": state.trial.trialListRequestResponse,
    "trialListRequestCompleted":state.trial.trialListRequestCompleted,
    "trialCreated":state.trial.trialCreated,
    "trialSelected": state.trial.trialSelected
});

const mapDispatchToProps = (dispatch) => ({
    trialActions: bindActionCreators(trialsActionCreator, dispatch)

});


export default connect(mapStateToProps, mapDispatchToProps)(MyTestsView);
