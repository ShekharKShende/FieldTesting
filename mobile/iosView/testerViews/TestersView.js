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
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

class TestersView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: ds.cloneWithRows([]),
            lastRow : -1
        };
    }

    componentDidMount() {
      if(config.NETWORK_STATUS) {
            this.getTesterList();
      }

    }

    getTesterList() {
      	this.props.testerActions.getTesters(config.MAX_LIMIT, config.MAX_RECORD_IN_PAGE,"id");
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.testerListRequestFailed) {
          AlertIOS.alert(nextProps.testerListRequestFailed);
      } else if (nextProps.testerListRequestCompleted || nextProps.testerCreated || nextProps.testerDeleteResponse || nextProps.testerEditResponse) {
        this.setState({lastRow: nextProps.testerListRequestResponse.content.length-1});
        this.setState({dataSource: ds.cloneWithRows(nextProps.testerListRequestResponse.content)});
      } 
    }

    rowPressed(row) {
      this.props.testerActions.selectTester(row);
      Actions.TesterDetailView();
    }

    render() {
        return (
            <View style={AppStyles.defaultContainer}>
              {config.NETWORK_STATUS?
                  <View style={{flex:0,flexDirection:"column"}}>
                    <View style={AppStyles.listSectionHeaderStyle}>
                        <Text style={[AppStyles.listsSectionTitle,{top: 20}]}>AVAILABLE</Text>
                    </View>
                    <ListView
                        style={{top: 20}}
                        dataSource={this.state.dataSource}
                        renderRow={this.renderRow.bind(this)}
                        renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
                        renderSeparator= {this.renderSeparator.bind(this)}
                    />
                    </View> :
                    <Text style={{alignSelf:'center', marginTop:200,  fontSize: 16,
                      color : '#B7BABB',
                      fontFamily: 'Helvetica Neue',
                      fontWeight: '500',}}> Not connected to Internet
           			    </Text>}
            </View>
        )
    }

    renderRow(row) {
        return (
            <TouchableOpacity key={row.id+''} onPress={() => this.rowPressed(row)}>
              <View style={styles.row}>
                <View style={[AppStyles.roundBlankImage, {marginLeft:22,marginTop:10,marginBottom:10}]} />
                <View style={styles.rowTextContainer}>
                    <Text style={AppStyles.itemTitleStyle}>{row.firstName + ' ' + row.lastName}</Text>
                </View>
              </View>
              <View style={styles.listSeparator} />
            </TouchableOpacity>
        );
    }

    renderSeparator(sectionData, rowID, category) {

      if(rowID != this.state.lastRow) {
        return (
            <View style={styles.listSeparator} key={rowID+''}>
              <View style={styles.leftSeparator}></View>
               <View style={styles.rightSeparator}></View>
            </View>
        )
      } else {
        return (
            <View key={rowID+''}/>
        )
      }
    }

  pressRow(row) {

  }
}

var styles = StyleSheet.create({
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
});

const mapStateToProps = (state) => ({
  "testerListRequestStarted": state.tester.testerListRequestStarted,
  "testerListRequestFailed": state.tester.testerListRequestFailed,
  "testerListRequestResponse": state.tester.testerListRequestResponse,
  "testerListRequestCompleted":state.tester.testerListRequestCompleted,
  "testerCreated": state.tester.testerCreated,
  "testerDeleteResponse":state.tester.testerDeleteResponse,
  "testerEditResponse":state.tester.testerEditResponse,
});

const mapDispatchToProps = (dispatch) => ({
  'testerActions': bindActionCreators(testerCreator, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(TestersView);
