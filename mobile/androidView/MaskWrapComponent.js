/**
 * Created by synerzip on 13/02/16.
 */
import React, {AppRegistry, StyleSheet, Text, View, ProgressBarAndroid} from 'react-native'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Progress from 'react-native-progress';


export function requireMaskComponent(Component) {


    class MaskWrapComponent extends React.Component {
        render() {
            return (
                <View style={{flex:1}}>
                    <Component />
                    {
                        this.props.isFetching
                            ?
                            <View style={[styles.maskBox,{backgroundColor:'#000000',opacity:0.5}]}>

                            </View>
                            :
                            <View />
                    }
                    {
                        this.props.isFetching
                            ?
                            <View style={styles.maskBox}>
                                <View style={styles.indicatorBox}>
                                    <ProgressBarAndroid styleAttr="Large" progress={1}
                                                        color="#ACADB0" style={[styles.centering]}/>
                                    <View style={styles.labelBox}>
                                        <Text style={styles.messageLabel}>{''}</Text>
                                    </View>
                                </View>
                            </View>
                            :
                            <View />
                    }


                </View>
            );
        }
    }
    var styles = StyleSheet.create({
        maskBox: {
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'transparent',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
        },
        indicatorBox: {
            padding: 10,
            width: 150,
            justifyContent: 'center',
            borderRadius: 10
        },
        labelBox: {
            flexWrap: 'wrap',
            width: 130,
            alignItems: 'center',
            justifyContent: 'center'
        },
        centering: {
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 1
        },
        messageLabel: {
            fontWeight: 'bold',
            color: '#190707',
            textAlign: 'center',
        }
    });
    const mapStateToProps = (state) => ({
        'isFetching': state.app.isFetching,
        'loadingMessage': state.app.loadingMessage
    });

    const mapDispatchToProps = (dispatch) => ({});

    return connect(mapStateToProps, mapDispatchToProps)(MaskWrapComponent);
}
