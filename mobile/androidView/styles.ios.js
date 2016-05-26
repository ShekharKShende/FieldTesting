/**
 * Global iOS App Styles
 *
 */
'use strict';

/* ==============================
  Initialise App
  =============================== */
// React
var React = require('react-native');

// App Globals
var AppConfig = require('./config.ios');

var {
  StyleSheet,
} = React;

/* ==============================
  Stylestext
  =============================== */
module.exports = StyleSheet.create({
	appContainer: {
    flex:1,
    backgroundColor: '#f1f1ef',
    marginTop: 64
  },
  defaultContainer: {
    flex:1,
    backgroundColor: '#f1f1ef',
    height: AppConfig.windowHeight,
    width: AppConfig.windowWidth,
  },

	/* Default */
	container: {
    position: 'relative',
    flex: 1,
    backgroundColor: '#FFFFFF',
    height: AppConfig.windowHeight,
    width: AppConfig.windowWidth,
  },
  containerCentered: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  imageHorizontalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10
  },

  /* Aligning items */
  rightAligned: {
    alignItems: 'flex-end',
  },


  h1: {
    fontFamily: AppConfig.baseFont,
    fontSize: 28,
    lineHeight: 32,
    color: AppConfig.primaryColor,
    margin: 0,
    marginTop: 4,
    marginBottom: 4,
    left: 0,
    right: 0,
  },
  h2: {
    fontFamily: AppConfig.baseFont,
    color: AppConfig.primaryColor,
    fontSize: 24,
    margin: 0,
    marginTop: 4,
    marginBottom: 4,
    left: 0,
    right: 0,
  },
  h3: {
    fontFamily: AppConfig.baseFont,
    fontWeight: '500',
    color: AppConfig.primaryColor,
    fontSize: 18,
    margin: 0,
    marginTop: 4,
    marginBottom: 8,
    left: 0,
    right: 0,
  },
  h4: {
    fontFamily: AppConfig.baseFont,
    fontWeight: '500',
    color: AppConfig.primaryColor,
    fontSize: 16,
    margin: 0,
    marginTop: 4,
    marginBottom: 8,
    left: 0,
    right: 0,
  },
  p: {
    fontFamily: AppConfig.baseFont,
    margin: 0,
    fontWeight: '500',
    color: AppConfig.textColor,
  },


  /* Helper Text Styles */
  centered: {
    textAlign: 'center',
  },
  textRightAligned: {
    textAlign: 'right',
  },

  /* Give me padding */
  paddingHorizontal: {
    paddingHorizontal: 20,
  },
  paddingLeft: {
    paddingLeft: 20,
  },
  paddingRight: {
    paddingRight: 20,
  },
  paddingVertical: {
    paddingVertical: 20,
  },
  paddingTop: {
    paddingTop: 20,
  },
  paddingBottom: {
    paddingBottom: 20,
  },

  /* General Spacing */
  hr: {
    left: 0,
    right: 0,
    borderBottomWidth: 1,
    borderBottomColor: AppConfig.borderColor,
    height: 1,
    backgroundColor: 'transparent',
    marginTop: 20,
    marginBottom: 20,
  },
  spacer_5: {
    left: 0, right: 0, height: 1,
    marginTop: 5,
  },
  spacer_10: {
    left: 0, right: 0, height: 1,
    marginTop: 10,
  },
  spacer_15: {
    left: 0, right: 0, height: 1,
    marginTop: 15,
  },
  spacer_20: {
    left: 0, right: 0, height: 1,
    marginTop: 20,
  },
  spacer_25: {
    left: 0, right: 0, height: 1,
    marginTop: 25,
  },
  spacer_30: {
    left: 0, right: 0, height: 1,
    marginTop: 30,
  },
  spacer_40: {
    left: 0, right: 0, height: 1,
    marginTop: 40,
  },

  /* Grid */
  grid_row: {
    left: 0,
    right: 0,
    flexDirection: 'row',
  },
  grid_full: {
    width: AppConfig.windowWidth,
  },
  grid_half: {
    width: AppConfig.grid_half,
  },
  grid_third: {
    width: AppConfig.grid_third,
  },
  grid_twoThirds: {
    width: AppConfig.grid_twoThirds,
  },
  grid_quarter: {
    width: AppConfig.grid_quarter,
  },
  grid_threeQuarters: {
    width: AppConfig.grid_threeQuarters,
  },

  /* Forms */
  formLabel: {
    textAlign: 'left',
    marginBottom: 10,
  },
  formInputText: {
    height: 36,
    borderColor: '#cccccc',
    borderWidth: 0.75,
    borderRadius: 3,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },

  /* Messages / alerts */
  msg: {
    right: 0,
    left: 0,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#B0BFA8",
    backgroundColor: "#DEF0D8",
    borderRadius: 4,
  },
  msg_text: {
    textAlign: "center",
    color: "#5F8951",
    fontWeight: "800"
  },

  /* Nav Bar */
  navbar: {
    flexDirection:'row',
    left:0,
    right:0,
    height:55,
    position:'absolute',
    top:0
  },
  navbarButton: {
    width: 26,
    height: 26,
    left: 20,
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    tintColor: '#FFFFFF'
  },
  rightNavbarButton: {
    width: 23,
    height: 23,
    left: 0,
    marginRight:7,
    top: 10,
  },
  leftNavbarButton: {
    width: 33,
    alignItems: 'center',
    justifyContent: 'center',
    height: 24,
    left: 10,
    top: 0,
  },
  navbarTitle: {
    color: '#999a9e',
    top: 0,
    fontSize: 18,
    fontFamily: 'Helvetica Neue',
    fontWeight: '400',
  },

  /* Custom Nav Bar */
  customNavBar: {
    flexDirection: 'row',
    backgroundColor: '#DDDDDD',
    paddingTop: 25,
    height: 65
  },
  navButtonContainer: {
    flex: 0.3,
    alignItems: 'center',
    flexDirection: 'row'
  },
  navButtonLabelContainer: {
    alignItems: 'center',
  },
  navBarButtonLabel: {
    color: '#1F7EF6',
    fontSize : 18,
    marginLeft :10,
  },
  navbarTitleForRoot: {
    color: '#999a9f',
    fontFamily: AppConfig.baseFont,
    top: 0,
    fontSize: 18,
    fontWeight: '900',
    textAlign:'center',
    width:200
  },
  navBarTitleContainer: {
    flex: 0.4,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
// Commen Styles
  textFieldStyle: {
    height: 44,
    paddingLeft:15,
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
    fontSize : 14,
    fontFamily: 'Helvetica Neue',
    fontWeight: '400',
  },

  navBarTitle: {
    color: '#7C7F7F',
    top: 0,
    fontSize: 18,
    fontFamily: 'Helvetica Neue',
    fontWeight: '400',
    textAlign:'center',
  },

 itemTitleStyle : {
   fontSize: 14,
   width:200,
   fontFamily: 'Helvetica Neue',
   fontWeight: '500',
 },

 listThumbnailStyle: {
     height :60,
     width :60,
 },

 statusTitleStyle: {
    fontSize: 12,
    color : '#B7BABB',
    fontFamily: 'Helvetica Neue',
    fontWeight: '500',
 },

 listTesterNameTextStyle : {
   color : '#FF2600',
   fontSize : 12,
   fontFamily: 'Helvetica Neue',
   fontWeight: '700',
 },
 checkInButton : {
   backgroundColor :'#FFFFFF',
   borderRadius : 3,
   borderWidth : 1,
   borderColor :'#1f7ef6',
   height : 25,
   width :100,
   alignItems:'center',
   justifyContent:'center'
 },
 checkOutButton : {
   backgroundColor :'#7ED221',
   borderRadius : 3,
   borderWidth : 1,
   borderColor :'#7ED221',
   height : 25,
   width :100,
   alignItems:'center',
   justifyContent:'center'
 },

 commentsButton : {
   backgroundColor :'#1f7ef6',
   borderRadius : 3,
   borderWidth : 1,
   borderColor :'#1f7ef6',
   height : 25,
   width :100,
   alignItems:'center',
   justifyContent:'center'
 },

 commentsText : {
   fontSize: 12,
   color : '#ADB4BA',
   fontFamily: 'Helvetica Neue',
   fontWeight: '500',
 },

 checkInButtonTextStyle : {
   color : '#1f7ef6',
   fontSize : 12,
   fontFamily: 'Helvetica Neue',
 },
 checkOutButtonTextStyle : {
   color : '#FFFFFF',
   fontSize : 12,
   fontFamily: 'Helvetica Neue',
   fontWeight: '500'
 },
 listSectionHeaderStyle: {
   height :12,
   flexDirection: 'row',
   alignItems:'center',
 },
 listsSectionTitle : {
   fontSize: 12,
   color : '#B7BABB',
   fontFamily: 'Helvetica Neue',
   fontWeight: '500',
   top:10,
   marginLeft:12,
 },
 roundBlankImage: {
   backgroundColor: "#b7bbbc",
   width: 35,
   marginTop:5,
   height: 35,
   borderRadius: 18,
 },
 checkOutInBannerTextStyle: {
   fontSize: 12,
   color : '#FFFFFF',
   fontFamily: 'Helvetica Neue',
   fontWeight: '500',
   alignSelf:'flex-end',
 },
 checkOutInBannerTextDateStyle: {
   fontSize: 12,
   color : '#FFFFFF',
   fontFamily: 'Helvetica Neue',
   fontWeight: '400',
   alignSelf:'flex-end',
 },
 checkOutHeaderContainer: {
    flex:0,
    backgroundColor :'#FF2600',
    flexDirection:'row',
    justifyContent:'space-between',
    paddingTop:7,
    paddingBottom:7,
 },
 checkInHeaderContainer: {
   flex:1,
   backgroundColor :'#b7bbbc',
   flexDirection:'row',
   justifyContent:'space-between',
   paddingTop:7,
   paddingBottom:7,
 },



});
