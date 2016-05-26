/**
 * Created by synerzip on 27/02/16.
 */
import React, {
    AppRegistry,
    Component,
    DrawerLayoutAndroid,
    LayoutAnimation,
    StyleSheet,
    Text,
    Image,
    View,
    TouchableOpacity,
    ToolbarAndroid
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {MKButton,MKColor} from 'react-native-material-kit';

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedOption: 'feed',
            title: 'FEED'
        }
    }

    toggleDrawer() {
        this.refs.drawer.openDrawer();
    }

    onOptionSelected(option) {
        this.refs.drawer.closeDrawer();
        LayoutAnimation.easeInEaseOut();
        var title = "";
        if (option == 'feed') {
            title = 'FEED';
        } else if (option == 'home') {
            title = 'HOME';
        } else if (option == 'search') {
            title = 'SEARCH';
        } else if (option == 'profile') {
            title = 'PROFILE';
        }
        this.setState({selectedOption: option, title: title});
    }

    _renderCenterScreen() {
        if (this.state.selectedOption == 'feed') {
            return (
                <View style={{flex: 1, alignItems: 'center'}}>
                    <Text style={{margin: 10, fontSize: 15, textAlign: 'right'}}>Feed Screen</Text>
                </View>
            );
        } else if (this.state.selectedOption == 'home') {
            return (
                <View style={{flex: 1, alignItems: 'center'}}>
                    <Text style={{margin: 10, fontSize: 15, textAlign: 'right'}}>Home Screen</Text>
                </View>
            );
        }
        return null;
    }

    render() {
        var navigationView = (
            <View style={{flex: 1, backgroundColor: '#fff'}}>
                <View style={styles.optionBox}>
                    <TouchableOpacity onPress={this.onOptionSelected.bind(this,'home')} style={{flex:1}}>
                        <View style={[styles.optionBox,{flex:1}]}>
                            <Image source={require('common/images/home.png')}
                                   style={{height:25,width:25}}/>
                            <View style={{marginLeft:10,justifyContent:'center',alignItems:'center'}}>
                                <Text style={styles.optionLabel}>Home</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.separator}/>
                <View style={styles.optionBox}>
                    <TouchableOpacity onPress={this.onOptionSelected.bind(this,'feed')} style={{flex:1}}>
                        <View style={[styles.optionBox,{flex:1}]}>
                            <Image source={require('common/images/feed.png')}
                                   style={{height:25,width:25}}/>
                            <View style={{marginLeft:10,justifyContent:'center',alignItems:'center'}}>
                                <Text style={styles.optionLabel}>Feed</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.separator}/>
                <View style={styles.optionBox}>
                    <TouchableOpacity onPress={this.onOptionSelected.bind(this,'search')} style={{flex:1}}>
                        <View style={[styles.optionBox,{flex:1}]}>
                            <Image source={require('common/images/search.png')}
                                   style={{height:25,width:25}}/>
                            <View style={{marginLeft:10,justifyContent:'center',alignItems:'center'}}>
                                <Text style={styles.optionLabel}>Search</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.separator}/>
                <View style={styles.optionBox}>
                    <TouchableOpacity onPress={this.onOptionSelected.bind(this,'profile')} style={{flex:1}}>
                        <View style={[styles.optionBox,{flex:1}]}>
                            <Image source={require('common/images/profile.png')}
                                   style={{height:25,width:25}}/>
                            <View style={{marginLeft:10,justifyContent:'center',alignItems:'center'}}>
                                <Text style={styles.optionLabel}>Profile</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.separator}/>
            </View>
        );

        return (
            <View style={{flex:1}}>
                <ToolbarAndroid
                    actions={[{title: 'Activity', icon: require('common/images/message.png'), show: 'always'}]}
                    navIcon={require('common/images/menu.png')}
                    onIconClicked={this.toggleDrawer.bind(this)}
                    style={styles.toolbar}
                    subtitle={this.state.actionText}
                    title={this.state.title}/>
                <DrawerLayoutAndroid
                    ref="drawer"
                    style={{flex:1}}
                    drawerWidth={250}
                    drawerPosition={DrawerLayoutAndroid.positions.Left}
                    renderNavigationView={() => navigationView}>
                    {this._renderCenterScreen()}
                </DrawerLayoutAndroid>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    toolbar: {
        backgroundColor: '#e9eaed',
        height: 56,
    },
    optionBox: {
        height: 40,
        flexDirection: 'row',
        padding: 5
    },
    optionLabel: {
        color: '#000000',
    },
    separator: {
        height: 1,
        backgroundColor: '#E0E0E1'
    }

});

export default Dashboard;