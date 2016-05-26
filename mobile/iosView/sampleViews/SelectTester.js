/**
 * Created by synerzip on 09/02/16.
 */
 var React = require('react-native');
 var {
     Image,
     ListView,
     TouchableHighlight,
     StyleSheet,
     RecyclerViewBackedScrollView,
     Text,
     View,
     Dimensions,
     TouchableOpacity,
     AlertIOS,
 } = React;

 import config from 'common/config';
 import { bindActionCreators } from 'redux';
 import { connect } from 'react-redux';
 import * as testerActionCreator from 'common/actions/tester';
 import {Actions} from 'react-native-router-flux'
 import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
 var AppStyles = require('../styles.ios');
 import * as testerCreator from 'common/actions/tester';
 import * as samplesCreator from 'common/actions/samples';

class SelectTester extends React.Component {
  constructor(props) {
      super(props);
      this.dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

  }

  componentWillMount() {
    this.getTesterList();
    //Reset selected tester at init time.
    this.props.testerActions.selectTester("");
  }

  selectTester(row) {
    this.props.testerActions.selectTester(row);
  }

  checkoutSample(){
    if(this.props.testerSelected){
      this.props.sampleActions.checkoutSample(this.props.sampleSelected, config.DEFAULT_FIELD_TEST.id, config.DEFAULT_SURVEY_FORM.id, this.props.testerSelected.id);
      // AlertIOS.alert("Sample ID: " + this.props.sampleSelected + " FieldTest: " + config.DEFAULT_FIELD_TEST.id + " Survey: " + config.DEFAULT_SURVEY_FORM.id + " TESTER: " + this.props.testerSelected.id);
    } else{
      AlertIOS.alert("Please select one tester");
    }
  }

  getTesterList() {
    if(config.NETWORK_STATUS) {
      this.props.testerActions.getTesters(config.MAX_LIMIT, config.MAX_RECORD_IN_PAGE,"id");
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.testerListRequestFailed) {
       AlertIOS.alert(nextProps.testerListRequestFailed);
    }
    if(nextProps.sampleCheckedOut){
      this.props.sampleActions.getSamples("All", 0, config.MAX_LIMIT, "id", "ASC");
      this.props.sampleActions.sampleCheckedOut();
      Actions.pop();
    }else if (nextProps.sampleCheckoutError){
      AlertIOS.alert(null,nextProps.sampleCheckoutError, this.onDismiss.bind(this));
    }
  }

   onDismiss() {
     this.props.sampleActions.onCheckoutSampleFinished();
   }

  render() {
      var testerList = <View />
      if(this.props.testerListRequestResponse){
        testerList = <ListView
                      dataSource={this.dataSource.cloneWithRows(this.props.testerListRequestResponse.content)}
                      renderRow={this.renderRow.bind(this)}
                      renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
                      renderSeparator= {this.renderSeparator.bind(this)}
                     />
      }
      return (
          <View style={AppStyles.defaultContainer}>
          <View style={AppStyles.customNavBar}>
                <View style={{flex: 0.3}}>
                    <TouchableOpacity style={[AppStyles.navButtonContainer,{flex:1}]}
                                      onPress={()=>Actions.pop()}>
                        <View style={[AppStyles.navButtonContainer,{flex:1}]}>
                            <View style={AppStyles.navButtonLabelContainer} >
                                <Text style={AppStyles.navBarButtonLabel}>Cancel</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={AppStyles.navBarTitleContainer}>
                    <Text style={AppStyles.navBarTitle}>SELECT TESTER</Text>
                </View>
                <View style={{flex: 0.3}}>
                    <TouchableOpacity style={[AppStyles.navButtonContainer,{flex:1}]} onPress={this.checkoutSample.bind(this)} ref ="donebutton">
                        <View style={[AppStyles.navButtonContainer,{paddingRight:10,flex:1,justifyContent:'flex-end'}]}>
                            <View style={AppStyles.navButtonLabelContainer}>
                                <Text style={AppStyles.navBarButtonLabel}>Done</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{height :1, backgroundColor : '#D8D8D6'}}></View>
            {this.props.isNetworkStatus?
            <View  style={{flex:0,flexDirection:"column"}}>
                <View style={AppStyles.listSectionHeaderStyle}>
                    <Text style={[AppStyles.listsSectionTitle]}>ASSIGN TESTERS</Text>
                </View>
              {testerList}
            </View> : <Text style={{alignSelf:'center', marginTop:200,  fontSize: 16,
              color : '#B7BABB',
              fontFamily: 'Helvetica Neue',
              fontWeight: '500',}}> Not connected to Internet
            </Text>}
          </View>
      )
  }

  renderRow(row) {
      var selectionView = this.getTesterSelectionView(row);
      return (
          <TouchableOpacity key={row.id+''} onPress={() =>  this.selectTester(row)}>
            <View style={styles.row}>
                <View style={[AppStyles.roundBlankImage, {marginLeft:22,marginTop:10,marginBottom:10}]} />
              <View style={styles.rowTextContainer}>
                  <Text style={AppStyles.itemTitleStyle}>{row.firstName + ' ' + row.lastName}</Text>
              </View>
              <View style={styles.selectorContainer}>
                  {selectionView}
              </View>
            </View>
            <View style={styles.listSeparator} />
          </TouchableOpacity>
      );
  }

  getTesterSelectionView(row) {
      if(this.props.testerSelected != "" && this.props.testerSelected.id == row.id) {
        return(<View style={styles.roundSelectedButton}/>)
      }else {
        return(<View style={styles.roundSelectButton}/>)
      }
    }

  renderSeparator(sectionData, rowID, category) {

    if(this.props.testerListRequestResponse.content.length -1 == rowID) {
        return (
          <View key={rowID+''} />
        )
    } else {
      return (
          <View style={styles.listSeparator} key={rowID+''}>
            <View style={styles.leftSeparator}></View>
             <View style={styles.rightSeparator}></View>
          </View>
      )
    }
  }
}

var styles = StyleSheet.create({
    selectorContainer: {
        height: 56,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-end',
        right: 10
    },
    rowTextContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        left: 22,
        top:22
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#ffffff',
    },

    listSeparator: {
       flex :0,
       flexDirection : 'row',
       backgroundColor : '#ADB4BA'
    },
    leftSeparator: {
        height: 1,
        width:84,
        backgroundColor : '#FFFFFF'
    },
    rightSeparator: {
        height: 1,
        backgroundColor : '#ADB4BA'
    },
    text: {
        color: '#000000',
    },
    roundSelectButton: {
        backgroundColor: "#FFFFFF",
        width: 20,
        height: 20,
        borderRadius: 10,
        borderColor: "#adb4ba",
        borderWidth: 2,
        alignItems: 'center'
    },
    roundSelectedButton: {
        backgroundColor: "#1f7ef6",
        width: 20,
        height: 20,
        borderRadius: 10,
        borderColor: "#1f7ef6",
        borderWidth: 2,
        alignItems: 'center'
    },
});

const mapStateToProps = (state) => ({
  "testerListRequestStarted": state.tester.testerListRequestStarted,
  "testerListRequestFailed": state.tester.testerListRequestFailed,
  "testerListRequestResponse": state.tester.testerListRequestResponse,
  "testerListRequestCompleted":state.tester.testerListRequestCompleted,
  "testerCreated": state.tester.testerCreated,
  "testerSelected": state.tester.testerSelected,
  "sampleSelected": state.sample.sampleSelected,
  "sampleCheckoutRequestStarted" : state.sample.sampleCheckoutRequestStarted,
  "sampleCheckedOut": state.sample.sampleCheckedOut,
  "sampleCheckoutError": state.sample.sampleCheckoutError,
  'isNetworkStatus': state.app.isNetworkStatus
});

const mapDispatchToProps = (dispatch) => ({
  'testerActions': bindActionCreators(testerCreator, dispatch),
  'sampleActions': bindActionCreators(samplesCreator, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectTester);
