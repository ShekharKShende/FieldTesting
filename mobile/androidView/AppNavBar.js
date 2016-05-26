import React, {TouchableOpacity, Animated, PropTypes, Text} from 'react-native';
import NavBar from 'react-native-router-flux/src/NavBar';
import NavbarButton from './NavbarButton';

export default class AppNavBar extends NavBar {
    static contextTypes = {
        drawer: PropTypes.object
    };

    componentWillMount() {

    }

    _renderLeftButton() {
      const { drawer } = this.context;
      console.log("This context");
      console.log(this.context);
      return(<NavbarButton style = {{top: 20,
      marginLeft:15,
      left : 0}}
          image={require('common/images/hamburger.png')}
          onPress={drawer.toggle}  />)
    }

    render() {
        const state = this.props.navigationState;
        if (this.props.renderLeftButton){
            this._renderLeftButton = this.props.renderLeftButton;
        }
        if (this.props.renderRightButton){
            this._renderRightButton = this.props.renderRightButton;
        }
        if (this.props.renderBackButton){
            this._renderBackButton = this.props.renderBackButton;
        }
        return (
            <Animated.View style={[state.navigationBarStyle]}>
                {state.children.map(this._renderTitle, this)}
                {this._renderBackButton()}
                {this._renderLeftButton()}
                {this._renderRightButton()}
            </Animated.View>
        );
    }
}
