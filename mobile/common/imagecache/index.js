/*
* (The MIT License)
* Copyright (c) 2015-2016 YunJiang.Fang <42550564@qq.com>
* @providesModule CacheImage
* @flow-weak
*/
'use strict';
var React = require('react-native');

var {
    View,
    Image,
    Text,
    StyleSheet,
} = React;


var md5 = require("./md5.js");
var image = require('./image.js');
var StorageMgr = require('./storageMgr.js');
var fs = require('react-native-fs');
var TimerMixin = require('react-timer-mixin');


/*list status change graph
*
*STATUS_NONE->[STATUS_LOADING]
*STATUS_LOADING->[STATUS_LOADED, STATUS_UNLOADED]
*
*/
var
STATUS_NONE = 0,
STATUS_LOADING = 1,
STATUS_LOADED = 2,
STATUS_UNLOADED = 3;

var storageMgr = new StorageMgr();
var db = StorageMgr.db;
var syncImageSource = {};
var cacheIdMgr = {};

var CacheImage = React.createClass({
    mixins: [TimerMixin],
	addImageRef(url, size, mdate) {
		return new Promise((resolve, reject) => {
            db.transaction((tx)=>{
                var ref = size?'1':'ref+1';
                tx.executeSql('UPDATE '+StorageMgr.TABLE_CACHE_IMAGE+' SET ref='+ref+' WHERE url=? AND mdate=?', [url, mdate], (tx, rs)=>{
                    if (rs.rowsAffected == 0) {
                        tx.executeSql('INSERT INTO '+StorageMgr.TABLE_CACHE_IMAGE+' (url, ref, size, time, mdate) VALUES (?, ?, ?, ?, ?)', [url, 1, size, parseInt(Date.now()/1000), mdate], (tx, rs)=>{
                            ////console.log('subImageRef <insert>', url, size);
                            resolve(true);
                        });
                    } else {
                        ////console.log('subImageRef <undo>', url, size);
                        resolve(true);
                    }
                });
            }, (error)=>{
                ////console.log('subImageRef <error>', url, size, error);
                resolve(false);
            });
		});
	},
	subImageRef(url, mdate) {
        var self = this;
		return new Promise((resolve, reject) => {
            db.transaction((tx)=>{
                tx.executeSql('SELECT ref,size FROM '+StorageMgr.TABLE_CACHE_IMAGE+' WHERE mdate=?', [mdate], function (tx, rs) {
                    var item = rs.rows.item(0);
                    var ref = item.ref;
                    var size = item.size;
                    if (ref == 1) {

                        tx.executeSql('DELETE FROM '+StorageMgr.TABLE_CACHE_IMAGE+' WHERE mdate=?', [mdate], async(tx, rs)=>{
                          //console.log('deleting photos');
                          //console.log(url);
                            await fs.unlink(storageMgr.getCacheFilePath(url));
                            await storageMgr.updateStorage(-size);
                            ////console.log('subImageRef <delete>', url);
                            resolve(true);
                        });
                    } else {
                        tx.executeSql('UPDATE '+StorageMgr.TABLE_CACHE_IMAGE+' SET ref=ref-1 WHERE mdate=? AND url=?', [mdate, url], (tx, rs)=>{
                            ////console.log('subImageRef <update>', url);
                            resolve(true);
                        });
                    }
                });
            }, (error)=>{
                ////console.log('subImageRef <error>', url, error);
                resolve(false);
            });
		});
	},
    checkCacheId(id, url, mdate, size) {
        var self = this;
        return new Promise((resolve, reject) => {
            db.transaction((tx)=>{
                tx.executeSql('SELECT mdate, url FROM '+StorageMgr.TABLE_CACHE_ID+' WHERE id=?', [id],  (tx, rs)=>{
                    if (rs.rows.length) {
                        var item = rs.rows.item(0);
                        var oldmdate = item.mdate;
                        var oldurl = item.url;
                        if (mdate != oldmdate) {
                            tx.executeSql('UPDATE '+StorageMgr.TABLE_CACHE_ID+' SET mdate=?,url=? WHERE id=?', [mdate, url, id],  async(tx, rs)=>{
                                ////console.log('checkCacheId <update oldurl>', id, url, size, oldurl);
                                await self.addImageRef(url, size, mdate);
                                await self.subImageRef(oldurl, oldmdate);
                                self.unlock();
                                resolve(true);
                            });
                        } else {
                            self.unlock();
                            resolve(true);
                        }
                    } else {
                        tx.executeSql('INSERT INTO '+StorageMgr.TABLE_CACHE_ID+' (id, url, mdate) VALUES (?, ?, ?)', [id, url, mdate], async(tx, rs)=>{
                            ////console.log('checkCacheId <insert new url>', id, url, size);
                            await self.addImageRef(url, size, mdate);
                            self.unlock();
                            resolve(true);
                        });
                    }
                });
            }, (error)=>{
                resolve(false);
                ////console.log('checkCacheId <error>', id, url, size, error);
                self.unlock();
            });
        });
    },
    deleteCacheImage(storage) {
        var self = this;
        return new Promise((resolve, reject) => {
            db.transaction((tx)=>{
                tx.executeSql('SELECT url,size FROM '+StorageMgr.TABLE_CACHE_IMAGE+' WHERE time=(SELECT MIN(time) FROM '+StorageMgr.TABLE_CACHE_IMAGE+')', [], function (tx, rs) {
                    if (rs.rows.length) {
                        var item = rs.rows.item(0);
                        var url = item.url;
                        var size = item.size;
                        tx.executeSql('DELETE FROM '+StorageMgr.TABLE_CACHE_IMAGE+' WHERE url=?', [url], (tx, rs)=>{
                            tx.executeSql('DELETE FROM '+StorageMgr.TABLE_CACHE_ID+' WHERE url=?', [url], async(tx, rs)=>{
                                ////console.log('deleteCacheImage <delete>', url, size);
                                storage -= size;
                                await fs.unlink(storageMgr.getCacheFilePath(url));
                                await storageMgr.updateStorage(-size);
                                resolve(storage);
                            });
                        });
                    }
                });
            }, (error)=>{
                ////console.log('deleteCacheImage <error>', error);
                reject(error);
            });
        });
    },
    checkCacheStorage(size) {
        var self = this;
        return new Promise(async(resolve, reject) => {
            var storage = storageMgr.storage + size;
            ////console.log('target:', storage);
            while (storage >= StorageMgr.CACHE_IMAGE_SIZE) {
                storage = await self.deleteCacheImage(storage);
                ////console.log('after:', storage);
            }
            resolve();
        });
    },
    isFileExist(filepath) {
        return new Promise((resolve, reject) => {
            fs.stat(filepath).then((rs) => {
                resolve(true);
            }).catch((err) => {
                resolve(false);
            });
        });
    },
    downloadImage(url, filepath, cacheId, filename, modifieddate) {
        var self = this;
        var ret =  fs.downloadFile(url, filepath).then(async (res)=>{
          //console.log("Inside File download" + modifieddate);

            self.setState({
                status:STATUS_LOADED,
                source:{uri:'file://'+filepath},
            });
            ////console.log(self.state);
            await self.checkCacheId(cacheId, filename, modifieddate, res.bytesWritten);
            await storageMgr.updateStorage(res.bytesWritten);
            // await self.checkCacheStorage(res.bytesWritten);
        }).catch(
            async (err)=>{
              //console.log("Error inside File download" + modifieddate);
                ////console.log(err);
                this.unlock();
                self.setState({
                    status:STATUS_UNLOADED,
                });
            }
        );
    },
    checkImageSource(cacheId, url, modifieddate) {
        var type = url.replace(/.*\.(.*)/, '$1');
        var mainUrl = cacheId + '' + modifieddate;
        //console.log('Main url');
        //console.log(mainUrl);
        if(type.length > 3) {
          if(type.includes('png')){
            type = 'png';
          }else if(type.includes('jpg')){
            type = 'jpg';
          }else if(type.includes('jpeg')){
            type = 'jpeg';
          }else {
            type = 'png';
          }
        }
        var filename =  md5(mainUrl) + '.' + type;
        var filepath = storageMgr.getCacheFilePath(filename);
        this.param = {cacheId:cacheId, url:url, filename:filename, filepath:filepath, modifieddate:modifieddate};
        this.syncCheckImageSource();
    },
    lock() {
        syncImageSource[this.param.filename] = true;
    },
    unlock() {
        delete syncImageSource[this.param.filename];
    },
    islock() {
        return syncImageSource[this.param.filename];
    },
    syncCheckImageSource() {
        if (this.islock()) {
            this.setTimeout(this.syncCheckImageSource, 100);
        } else {
            this.doCheckImageSource();
        }
    },
    async doCheckImageSource() {
        var {cacheId, url, filename, filepath, modifieddate} = this.param;
        //console.log('filepath: ' + filepath);
        this.lock();
        var isExist = await this.isFileExist(filepath);
        //console.log(this.param);
        //console.log('Is File exist', isExist);
        if (isExist) {

            this.setState({
                status:STATUS_LOADED,
                source:{uri:'file://'+filepath},
            });
            //console.log('Date : ' + modifieddate);
            this.checkCacheId(cacheId, filename, modifieddate);
        } else {
            this.downloadImage(url, filepath, cacheId, filename, modifieddate);
        }
    },
    getInitialState() {
        return {
            status:STATUS_NONE,
        }
    },
    componentWillMount() {
        this.reloadState();
    },
    componentWillUnmount: function() {
        //console.log('cacheid');
        //console.log(this.props.cacheId);
        delete cacheIdMgr[this.props.cacheId];
    },
    renderLoading() {

        return (

                <Image
                  style={styles.spinner}
                  source={require('image!loading_spinner')}>
                </Image>

        );
    },
    renderLocalFile() {
        return (
            <Image
                {...this.props}
                source={this.state.source}
                >
                {this.props.children}
            </Image>
        );
    },
    reloadState: function(){
      var {cacheId, url, modifieddate} = this.props;
      this.setState({modifieddate:modifieddate});
      //console.log("Image Cache Id " + cacheId);

      if (cacheIdMgr[cacheId]) {
        console.log('duplicate cacheId');
          // console.error('duplicate cacheId');
          // return;
      }
      cacheIdMgr[cacheId] = true;
      this.setState({status:STATUS_LOADING});
      this.checkImageSource(cacheId, url, modifieddate);
    },
    render() {
        if (this.state.status === STATUS_LOADING) {
            return this.renderLoading();
        } else if (this.state.status === STATUS_LOADED) {
            if(this.props.modifieddate != this.state.modifieddate){
              this.reloadState();
              return this.renderLoading();
            }else{
              return this.renderLocalFile();
            }
        } else {
            return (
                <Image
                    {...this.props}
                    source={this.props.defaultImage}
                    >
                    {this.props.children}
                </Image>
            )
        }
    },
});

CacheImage.clear = storageMgr.clear;
module.exports = CacheImage;

var styles = StyleSheet.create({
  spinner: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    backgroundColor: 'transparent',

  },
});
