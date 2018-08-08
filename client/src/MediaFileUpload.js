/* global WaveSurfer */

import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
const axios = require('axios');

var React = require('react'),
    S3Upload = require('./s3upload.js');

/**
 * This class is a react component that renders a file input then uses ffmpeg.js to provide extras including
 * - transcoding all image/audio/video formats for preview
 * - selection by file input OR pasting a URL
 * - automatic content type detection using magic numbers
 * - additional waveform preview for audio/video formats using wavesurfer.js
 * - UI to select crop range of image/audio/video formats
 * - final crop/transcode and upload to S3 in a variety of formats to ensure media formats exist to support the widest range of clients.
 *      - image => png
 *      - audio => mp3lq(alexa/googlehome), mp3 and audio.webm
 *      - video => mp3lq(alexa/googlehome), mp4 and video.webm
 * 
 * !! All transcoding is done in the browser client using ffmpeg (via emscripten). This is great for reducing the load on a web server but TRANSCODING MAY FAIL for clients with limited memory and is slower that running ffmpeg natively. 50MB video files seem fine and transcode within a minute.
 * 
 * Using this component requires three routes to your node.js server.
 * /worker/[mp4|webm|other]  to deliver the javascript of the various worker threads
 * /proxy  to facilitate download of external URLs
 * /s3 - handle file requests, generate signing token and redirect to s3 (so files can stay private on s3)
 * 
 * This component is a fork of npm module react-s3-uploader.
 * It uses wavesurfer.js for audio preview
 * It uses ffmpeg.js plus kagami builds for transcoding.
 * 
 */
class MediaFileUpload extends React.Component {

  constructor(props) {
    super(props);
       if (typeof WaveSurfer === undefined) {
            throw new Error('WaveSurfer is undefined!');
        }
     this._wavesurfer = null;    
     this.state ={
      regions:{},
      file:null,
      isWorkerLoaded:false,
      uploaded:{},
      externalUrl:'',
      cropStart:0,
      cropEnd:0
    }
    
    this.onChange = this.onChange.bind(this)
    this.initMp4Worker=this.initMp4Worker.bind(this);
    this.initWebmWorker=this.initWebmWorker.bind(this);
    this.initOtherWorker=this.initOtherWorker.bind(this);
    this.stopUpload=this.stopUpload.bind(this);
    this.uploadFile=this.uploadFile.bind(this);
    this.workerOnMessage=this.workerOnMessage.bind(this);
    this.processWebmVideo=this.processWebmVideo.bind(this);
    this.processMp4Video=this.processMp4Video.bind(this);
    this.processWebmAudio=this.processWebmAudio.bind(this);
    this.processMp3Audio=this.processMp3Audio.bind(this);
    this.processMp3AudioLowQuality=this.processMp3AudioLowQuality.bind(this);
    this.processCopy=this.processCopy.bind(this);
    this.startFileUpload=this.startFileUpload.bind(this);
    this.downloadAndConvert=this.downloadAndConvert.bind(this);
    this.updateExternalUrl=this.updateExternalUrl.bind(this);
    this.generatePreview=this.generatePreview.bind(this);
    this.isWorkerLoaded = this.isWorkerLoaded.bind(this);
    this.processImagePreview = this.processImagePreview.bind(this);
    this.processAudioPreview = this.processAudioPreview.bind(this);
    this.processVideoPreview = this.processVideoPreview.bind(this);
    this.cropImage = this.cropImage.bind(this);
    this.resetForm = this.resetForm.bind(this);
    this.isPreview = this.isPreview.bind(this);
    this.startAudioPreview = this.startAudioPreview.bind(this);
    this.startVideoPreview = this.startVideoPreview.bind(this);
    this.crop = this.crop.bind(this);
    this.finishAll = this.finishAll.bind(this);
    this.addRange = this.addRange.bind(this);
    this.createWaveSurfer = this.createWaveSurfer.bind(this);
    this.zoom = this.zoom.bind(this);
    this.handleRegionChange = this.handleRegionChange.bind(this);
    this.previewPlay = this.previewPlay.bind(this);
  }
    // init
    componentDidMount() {
       this.initWebmWorker();
       this.initMp4Worker();   
       this.initOtherWorker();   
       console.log(['init media',this.props.currentMedia]);
       if (this.props.currentMedia) {
           this.setState(this.props.currentMedia)
       }
    };
    
    initWebmWorker() {
        let webmWorker = new Worker(this.props.publicUrlPrefix+"/worker/?worker=worker-webm");
        webmWorker.onmessage=this.workerOnMessage;;
        this.setState({webmWorker:webmWorker});
    };

    initMp4Worker() {
        let mp4Worker = new Worker(this.props.publicUrlPrefix+"/worker?worker=worker-mp4");
        mp4Worker.onmessage=this.workerOnMessage;;
        this.setState({mp4Worker:mp4Worker}); //webmWorker:webmWorker,
    };
    
    initOtherWorker() {
        let otherWorker = new Worker(this.props.publicUrlPrefix+"/worker?worker=worker-all-codecs");
        otherWorker.onmessage=this.workerOnMessage;;
        this.setState({otherWorker:otherWorker}); //webmWorker:webmWorker,
    };
    
     
    // start point - file selected
    // save selected file to state and clear other state
    onChange(e) {
        let that = this;
        let file = e.target.files[0];
        if (file && this.isWorkerLoaded()) {
            console.log(['CHEKC FILE LENGth',file.size,file,this.props.fileSizeLimit]);
            if (file.size > this.props.fileSizeLimit) {
               this.resetForm();
               let inMb = parseInt(file.size/1048576,10);
               let limitMb = parseInt(this.props.fileSizeLimit/1048576,10);
                //parseInt((this.props.maxFileSize/1048576),10);
               this.setState({'uploadMessage':'The file you selected is '+inMb+'MB which larger than the '+limitMb+'MB limit.'});
            } else {
                that.startFileUpload(file);
            }
            
        }
    }
    
    isWorkerLoaded() {
        return this.state.webmWorker != null && this.state.mp4Worker != null &&this.state.otherWorker != null;
    };
    
    downloadAndConvert(e) {
        console.log(['CONVERT',e.target.value]);
        
      let that=this;
      let parts = e.target.value.split('/');
      let fileName=parts[parts.length-1];
      axios({url:this.props.publicUrlPrefix+'/proxy?url='+encodeURIComponent(e.target.value),method:'get',responseType:'arraybuffer'}).then(function(response) {
        if (response.status===200) {
            if (response.data) {
                const fileType = require('file-type');
                let fileMeta=fileType(response.data);
                 let mimeType=fileMeta?fileMeta.mime:'';
                 let file = new File([new Uint8Array(response.data)],fileName,{type:mimeType})
                 that.startFileUpload(file);
            }
        } else {
            console.log(['proxy failed'])
            that.setState({'uploadMessage':'Failed upload '+response.status});
        }
      }).catch(function(err) {
           console.log(['proxy failed', err])
            that.setState({'uploadMessage':'Fail: ' + err.message});
      });
    };
    
    startFileUpload(file) {
        let that=this;
        let fileTypeParts = file.type.split("/");
        var reader  = new FileReader();
        reader.addEventListener("load", function () {
            let fileNameParts = file.name.split(".");
            let fileNameExtension = fileNameParts[fileNameParts.length-1];
            let fileNameBase = fileNameParts.slice(0,fileNameParts.length-1).join(".");
            if (that.props.scrubFilename) fileNameBase = that.props.scrubFilename(fileNameBase);
            let fileName = fileNameBase+"."+fileNameExtension;
            let content = new Uint8Array(reader.result);
            that.clearForm();
            that.setState({ fileName: fileName, fileNameBase: fileNameBase, fileType: file.type, content:content,mediaLength:0,mediaProgress:0,selected:true});
            that.generatePreview(file);
            //if (fileTypeParts[0]=="image" && (fileTypeParts[1]=="gif" || fileTypeParts[1]=="jpg"|| fileTypeParts[1]=="jpeg" ||fileTypeParts[1]=="png")) {
                //// scale down image to jpg
                //that.processImage(file,that.uploadFile);
            //} else {
                //that.handleProcessing();
            //}
        }, false);
        reader.readAsArrayBuffer(file);
    };
    
    generatePreview(f) {
        let that=this;
        //// VIDEO
        if (f.type && f.type.startsWith('video/')) {
            that.setState({active:true});
            that.startVideoPreview(f);
        ////AUDIO  
        } else if (f.type && f.type.startsWith('audio/')) {
            that.setState({active:true});
            that.startAudioPreview(f);
        } else if (f.type && f.type.startsWith('image/')) {
            that.processImagePreview(f);
        }
    };
    
  
    crop() {
        let that=this;
        let fileTypeParts=this.state.fileTypeOut.split("/");
        let newState={audioUrlPreview:null,videoUrlPreview:null}
        newState.workerQueue=that.createWorkerQueue(fileTypeParts); 
        that.setState(newState);
        this._wavesurfer.destroy();
        setTimeout(function() {
            that.handleProcessing();
        },50);
    };
  
    createWorkerQueue(fileTypeParts) {
        if (fileTypeParts[0]==="audio") {
            return ['mp3AudioLowQuality','mp3Audio','webmAudio','finish'];
        } else if (fileTypeParts[0]==="video") {
            return ['mp3AudioLowQuality','mp4Video','webmVideo','finish'];
        } else {
            return ['copy'];
        }
    };
    
    finishAll() {
        let that=this;
        this.resetForm();
        setTimeout(function() {
            let newState={uploadMessage:'Finished',selected:false,active:false,imagePreview:null,audioUrlPreview:null,videoUrlPreview:null};
            newState.audioUrlMp3lq=that.state.uploaded.mp3lq;
            newState.audioUrlMp3=that.state.uploaded.mp3;
            newState.audioUrlWebm=that.state.uploaded.webmaudio;
            newState.videoUrlMp4=that.state.uploaded.mp4;
            newState.videoUrlWebm=that.state.uploaded.webmvideo;
            that.setState(newState);
            that.props.onFinish(that.state.uploaded);            
        },50);
    };
    
    handleProcessing() {
        let that=this;
        this.setState({'active':true});
        let functionMap={
            webmVideo:this.processWebmVideo,
            webmAudio:this.processWebmAudio,
            mp4Video:this.processMp4Video,
            mp3Audio:this.processMp3Audio,
            mp3AudioLowQuality:this.processMp3AudioLowQuality,
            copy:this.processCopy,
            audioPreview:this.processAudioPreview,
            videoPreview:this.processVideoPreview,
            finish:this.finishAll
        }
        let queue = this.state.workerQueue;
        if (queue && queue.length > 0) {
            if (functionMap.hasOwnProperty(queue[0])) {
                let nextFunction = functionMap[queue[0]];
                that.setState({mediaLength:0,mediaProgress:0,workerQueue:queue.slice(1)});
                nextFunction();
            }
        }
    } ;
    
    workerOnMessage(event) {
            let that=this;
            var message = event.data;
            if (message.type === "ready") {
                that.setState({'isWorkerLoaded':true}) 
                //webmWorker.postMessage({
                    //type: "run",
                    //arguments: ["-help"]
                //});
            } else if (message.type === "stdout") {
   //             console.log(message.data)
            } else if (message.type === "stderr") {
                console.log(message.data)
                // CAPTURE PROGRESS INFO
                
                if (message.data && message.data.trim().startsWith('Duration:')) {
                    let duration=this.progressToSeconds(message.data.trim().slice(10).split(",")[0]);
                    if ((that.state.fileNameOut && that.state.fileNameOut.endsWith('.preview.mp3')) || (that.state.fileNameOut && that.state.fileNameOut.endsWith('.preview.mp4'))) {
                        // skip duration override
                    } else {
                        if (duration > this.state.maxDuration) {
                            duration = this.state.maxDuration;
                        }
                    } 
                    that.setState({'mediaProgress':0,'mediaLength':duration,conversionProgress:0});
                    //console.log(['DUR',duration,message.data]);
                    
                } else if (message.data && message.data.indexOf('time=')>0) {
                    let time=this.progressToSeconds(message.data.trim().split("time=")[1].split(' ')[0]);
                    
                    if (parseFloat(this.state.startOffset,10) > 0) time = time - parseFloat(this.state.startOffset,10);
                    let progress=time/that.state.mediaLength*100;
                   // console.log(['FRAME',that.state.startOffset,message.data.trim().split("time=")[1].split(' ')[0],time,progress,message.data])
                    that.setState({'mediaProgress':progress});
                } else {
                    // match problem output
                    console.log(message.data)
                }
                
            } else if (message.type === "run") {
               // console.log("worker start")
            } else if (message.type === "done") {
                if (message.data && message.data.MEMFS && message.data.MEMFS.length > 0 && that.state.fileNameOut && that.state.fileTypeOut) {
                    let f = new File([message.data.MEMFS[0].data],that.state.fileNameOut,{type: that.state.fileTypeOut})
                    let stateUpdate={};
                        
                    if (that.state.fileNameOut && that.state.fileNameOut.endsWith('.preview.mp3') || that.state.fileNameOut && that.state.fileNameOut.endsWith('.preview.mp4')) {
                            if (that.state.fileNameOut && that.state.fileNameOut.endsWith('.preview.mp3')) {
                                stateUpdate.active=false;
                                stateUpdate.uploadMessage='Audio preview complete'
                                stateUpdate.audioUrlPreview=true; //event.target.result
                                that.createWaveSurfer('audio',that.props.audioMaxLength);
                                that._wavesurfer.load(URL.createObjectURL(f));
                                console.log(that._wavesurfer.regions);
                                that._wavesurfer.on('ready', function () {
                                    console.log(['ready',that.props.audioMaxLength,that._wavesurfer.getDuration(),Math.min(that.props.audioMaxLength,that._wavesurfer.getDuration())]);
                                    that.addRange(0,Math.min(that.props.audioMaxLength,that._wavesurfer.getDuration()));
                                    that.setState({cropStart:0,cropEnd:Math.min(that.props.audioMaxLength,that._wavesurfer.getDuration())});
                                });
                            } else if (that.state.fileNameOut && that.state.fileNameOut.endsWith('.preview.mp4')) {
                                stateUpdate.videoUrlPreview=true; //event.target.result
                                stateUpdate.uploadMessage='Video preview complete'
                                that.createWaveSurfer('video',that.props.videoMaxLength);
                                that._wavesurfer.load(URL.createObjectURL(f));
                                console.log(that._wavesurfer.regions);
                                that._wavesurfer.on('ready', function () {
                                    console.log(['ready',that.props.videoMaxLength,that._wavesurfer.getDuration(),Math.min(that.props.videoMaxLength,that._wavesurfer.getDuration())]);
                                    that.addRange(0,Math.min(that.props.videoMaxLength,that._wavesurfer.getDuration()));
                                    that.setState({cropStart:0,cropEnd:Math.min(that.props.videoMaxLength,that._wavesurfer.getDuration())});
                                });
                                stateUpdate.active=false;
                            }
                            that.setState(stateUpdate);
                    } else {
                        //// read as dataurl, generate preview, save/upload file and call next processing step
                        var reader  = new FileReader();
                        reader.addEventListener("load", function (event) {
                            console.log('LOADED',that.state.fileNameOut);
                            // contrained filenames after upload ensures that file extensions are usable
                            if (that.state.fileNameOut && that.state.fileNameOut.endsWith('.video.webm')) {
                                stateUpdate.videoUrlWebm=event.target.result
                            } else if (that.state.fileNameOut && that.state.fileNameOut.endsWith('.audio.webm')) {
                                stateUpdate.audioUrlWebm=event.target.result
                            } else  if (that.state.fileNameOut && that.state.fileNameOut.endsWith('.low.mp3')) {
                                stateUpdate.audioUrlMp3lq=event.target.result
                            } else if (that.state.fileNameOut && that.state.fileNameOut.endsWith('.mp3')) {
                                stateUpdate.audioUrlMp3=event.target.result
                            } else if (that.state.fileNameOut && that.state.fileNameOut.endsWith('.mp4')) {
                                stateUpdate.videoUrlMp4=event.target.result
                            }
                            that.setState(stateUpdate);
                            that.setState({'uploadMessage':"Uploading "+f.name})
                            that.uploadFile(f).then(function() {
                                that.handleProcessing();
                            })
                        
                        });
                        reader.readAsDataURL(f);                        
                    }
                }
            } else {
                console.log(["worker ????",message])
            }
        
    };
     

    createWaveSurfer(mediaType,maxDuration) {
        let that=this;
        this._wavesurfer = WaveSurfer.create({
            container: document.querySelector('#waveform'+that.props.name),
            //mediaElement: document.querySelector('#wavemedia'),
            waveColor: '#A8DBA8',
            progressColor: '#3B8686',
            backend: 'MediaElement',
            scrollParent: true,
            interact: false,
            mediaControls: true,
            responsive:true,
            mediaType: mediaType,
            plugins: [
            WaveSurfer.regions.create({
                regions: [{
                    id:'One',
                    start: 0,
                    end: 5,
                    maxLength:maxDuration,
                    minLength:1,
                    color: 'hsla(400, 100%, 30%, 0.5)'
                }]   
            }),
            WaveSurfer.timeline.create({
                container: '#wave-timeline'+that.props.name,
                timeInterval: 0.5,
                  height: 30,
                  primaryFontColor: '#00f',
                  primaryColor: '#00f'
            })
        ]
        });
        this._wavesurfer.on('region-update-end',function(e) {
            let newState={cropStart:Math.round(e.start*100)/100,cropEnd:Math.round(e.end*100)/100};
            that.setState(newState);
            console.log(['region-update-end',e]);
        });
    };

    
    addRange(start,end) {
        if (this._wavesurfer.regions.list.One) {
            this._wavesurfer.regions.list.One.update({
                    start: start,
                    end: end,
                    color: 'hsla(400, 10%, 30%, 0.5)'
                })    
        }
        
        
    };
     
     
   
    uploadFile(file) {
        if (!file) {
            file = new File([this.state.content],this.state.fileNameOut,{type:this.state.fileTypeOut});
        }
        //if (!callback) callback = this.props.onFinish
        let that=this;
        this.setState({'uploadMessage':"Uploading "+file.name,active:true})
        return new Promise(function(resolve,reject) {
            that.myUploader = new S3Upload({
                files: [file],
                signingUrl: that.props.signingUrl,
                getSignedUrl: that.props.getSignedUrl,
                preprocess: that.props.preprocess,
                onSignedUrl: that.props.onSignedUrl,
                onProgress: function(percentage,message) {
                    that.setState({mediaProgress:percentage})           
                    if (that.props.onProgress) that.props.onProgress(percentage,message);  
                } ,
                onFinishS3Put: function(result) {
                    let uploaded = that.state.uploaded;
                    if (that.state.uploadField) {
                        uploaded[that.state.uploadField]=that.props.publicUrlPrefix+result.publicUrl;
                        that.setState({uploaded:uploaded});                    
                        that.setState({active:true});                    
                    }
                    resolve();
                },
                onError: function(message) {
                    that.setState({uploadMessage:"ERROR: "+message});
                    if (that.props.onError) that.props.onError(message);
                    reject();
                },
                signingUrlMethod: that.props.signingUrlMethod,
                signingUrlHeaders: that.props.signingUrlHeaders,
                signingUrlQueryParams: that.props.signingUrlQueryParams,
                signingUrlWithCredentials: that.props.signingUrlWithCredentials,
                uploadRequestHeaders: that.props.uploadRequestHeaders,
                contentDisposition: that.props.contentDisposition,
                server: that.props.server,
                //scrubFilename: that.props.scrubFilename,
                s3path: that.props.s3path
            });            
        });
    };
             
    //// IMAGE PROCESSING
    dataURItoBlob(dataURI) {
        // convert base64 to raw binary data held in a string
        // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
        var byteString = atob(dataURI.split(',')[1]);
        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        // write the bytes of the string to an ArrayBuffer
        var ab = new ArrayBuffer(byteString.length);
        var dw = new DataView(ab);
        for(var i = 0; i < byteString.length; i++) {
            dw.setUint8(i, byteString.charCodeAt(i));
        }
        // write the ArrayBuffer to a blob, and you're done
        return new Blob([ab], {type: mimeString});
    }
    
    resize (file, maxWidth, maxHeight, fn) {
        let that = this;
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (event) {
            var dataUrl = event.target.result;

            var image = new Image();
            image.src = dataUrl;
            image.onload = function () {
                var resizedDataUrl = that.resizeImage(image, maxWidth, maxHeight, 0.7);
                fn(resizedDataUrl);
            };
        };
    }
    
    resizeImage(image, maxWidth, maxHeight, quality) {
        var canvas = document.createElement('canvas');

        var width = image.width;
        var height = image.height;

        if (width > height) {
            if (width > maxWidth) {
                height = Math.round(height * maxWidth / width);
                width = maxWidth;
            }
        } else {
            if (height > maxHeight) {
                width = Math.round(width * maxHeight / height);
                height = maxHeight;
            }
        }

        canvas.width = width;
        canvas.height = height;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0, width, height);
        return canvas.toDataURL("image/png", quality);
    }
    
 
   
   // other
    stopUpload() {
        let that=this;
        console.log('STOP');
        if (this.state.webmWorker) {
            this.state.webmWorker.terminate();
        }
        if (this.state.mp4Worker) {
            this.state.mp4Worker.terminate();
        }
        this.myUploader && this.myUploader.abortUpload();
        this.setState({'uploadQueue':[],'uploadMessage':'','active':false,'selected':false});
        this.initWebmWorker();
        this.initMp4Worker();   
        that.resetForm();
        if (this.props.currentMedia) {
           this.setState(this.props.currentMedia)
       }  
    };
    
    resetForm() {
        let that=this;
        let stateUpdate={ dataUrl:null,mediaProgress:0,active:false,selected:false};
        stateUpdate.audioUrlPreview=null
        stateUpdate.audioUrlMp3=null
        stateUpdate.audioUrlMp3lq=null
        stateUpdate.audioUrlWebm=null
        stateUpdate.videoUrlWebm=null
        stateUpdate.videoUrlMp4=null
        stateUpdate.videoUrlPreview=null
        stateUpdate.imageUrl=null
        stateUpdate.imageUrlPreview=null
        stateUpdate.cropStart=0
        stateUpdate.cropEnd=0
        that.setState(stateUpdate);
        if (this._wavesurfer) this._wavesurfer.destroy();
    };
    
    clearForm() {
        let that=this;
        let stateUpdate={ dataUrl:null
            ,mediaProgress:0
            ,active:false
        };
        stateUpdate.audioUrlPreview=null
        stateUpdate.audioUrlMp3=null
        stateUpdate.audioUrlMp3lq=null
        stateUpdate.audioUrlWebm=null
        stateUpdate.videoUrlWebm=null
        stateUpdate.videoUrlMp4=null
        stateUpdate.videoUrlPreview=null
        stateUpdate.imageUrl=null
        stateUpdate.imageUrlPreview=null
        that.setState(stateUpdate);
    };
    
    
  
 
    processWebmVideo() {
        let that = this;
        // bypass if raw format is already mp3
        if (false && this.state.fileType==="video/webm") {
            that.setState({uploadField:'webmvideo',fileNameOut:that.state.fileNameBase + ".video.webm",fileTypeOut:"video/webm"});
            return this.processCopy();
        } else {
            
            that.setState({uploadField:'webmvideo',fileNameOut:this.state.fileNameBase + ".video.webm",fileTypeOut:"video/webm",'uploadMessage':"Transcoding to Webm video"});
            //that.setState({mp4FileName:fileNameBase + ".webm",mp4FileType:"video/webm"});
            
            
            let transcodeArguments=[];
            if (this.state.cropStart > 0) {
                transcodeArguments.push("-ss");
                transcodeArguments.push(this.secondsToProgress(this.state.cropStart));
                this.setState({"startOffset":this.state.cropStart});
            }
            if (this.state.cropEnd > 0) {
                transcodeArguments.push("-t");
                let duration = this.secondsToProgress(this.state.cropEnd - this.state.cropStart);
                if (duration > this.props.videoMaxLength) duration = this.props.videoMaxLength;
                transcodeArguments.push(duration);
            }
            transcodeArguments = ["-i","input_"+that.state.fileName,"-strict","-2"].concat(transcodeArguments);
            transcodeArguments.push(that.state.fileNameBase + ".video.webm");
            console.log(['TC',transcodeArguments]);
            that.state.webmWorker.postMessage({
              type: "run",
              arguments: transcodeArguments,
              MEMFS: [
                {
                  "name": "input_"+this.state.fileName,
                  "data": this.state.content
                }
              ],
            });
        }
    }
    
    processMp4Video() {
        let that = this;
        // bypass if raw format is already mp3
        if (false && this.state.fileType==="video/mp4") {
            that.setState({uploadField:'mp4',fileNameOut:that.state.fileNameBase + ".mp4",fileTypeOut:"video/mp4"});
            return this.processCopy();
        } else {
            
            that.setState({uploadField:'mp4',fileNameOut:that.state.fileNameBase + ".mp4",fileTypeOut:"video/mp4",'uploadMessage':"Transcoding to MP4 video"});
            
            
            let transcodeArguments=[];
            if (this.state.cropStart > 0) {
                transcodeArguments.push("-ss");
                transcodeArguments.push(this.secondsToProgress(this.state.cropStart));
                this.setState({"startOffset":this.state.cropStart});
            }
            if (this.state.cropEnd > 0) {
                transcodeArguments.push("-t");
                let duration = this.secondsToProgress(this.state.cropEnd - this.state.cropStart);
                if (duration > this.props.videoMaxLength) duration = this.props.videoMaxLength;
                transcodeArguments.push(duration);
            }
            transcodeArguments = ["-i","input_"+that.state.fileName,"-strict","-2"].concat(transcodeArguments);
            transcodeArguments.push(that.state.fileNameBase + ".video.mp4");
            that.state.mp4Worker.postMessage({
              type: "run",
              arguments: transcodeArguments,
              MEMFS: [
                {
                  "name": "input_"+that.state.fileName,
                  "data": that.state.content
                }
              ],
            });
        }
    };
     
    processWebmAudio() {
        let that = this;
        // bypass if raw format is already mp3
        if (false && this.state.fileType==="audio/webm") {
            that.setState({uploadField:'webmaudio',fileNameOut:that.state.fileNameBase + ".audio.webm",fileTypeOut:"audio/webm"});
            return this.processCopy();
        } else {
            that.setState({uploadField:'webmaudio',fileNameOut:that.state.fileNameBase + ".audio.webm",fileTypeOut:"audio/webm",'uploadMessage':"Transcoding to Webm audio"});
            
            
            let transcodeArguments=[];
            if (this.state.cropStart > 0) {
                transcodeArguments.push("-ss");
                transcodeArguments.push(this.secondsToProgress(this.state.cropStart));
                this.setState({"startOffset":this.state.cropStart});
            }
            if (this.state.cropEnd > 0) {
                transcodeArguments.push("-t");
                let duration = this.secondsToProgress(this.state.cropEnd - this.state.cropStart);
                if (duration > this.props.audioMaxLength) duration = this.props.audioMaxLength;
                transcodeArguments.push(duration);
            }
            transcodeArguments = ["-i","input_"+that.state.fileName,"-vf","showinfo","-strict","-2"].concat(transcodeArguments);
            transcodeArguments.push(that.state.fileNameBase + ".audio.webm");
            console.log(['TC',transcodeArguments]);
            that.state.webmWorker.postMessage({
              type: "run",
              arguments: transcodeArguments,
              MEMFS: [
                {
                  "name": "input_"+that.state.fileName,
                  "data": that.state.content
                }
              ],
            });
        }
    };
    
    processMp3Audio() {
        let that = this;
        // bypass if raw format is already mp3
        if (false && this.state.fileType==="audio/mp3") {
            that.setState({uploadField:'mp3',fileNameOut:that.state.fileNameBase + ".mp3",fileTypeOut:"audio/mp3"});
            return this.processCopy();
        } else {
            that.setState({uploadField:'mp3',fileNameOut:that.state.fileNameBase + ".mp3",fileTypeOut:"audio/mp3",'uploadMessage':"Transcoding to MP3"});
             
            let transcodeArguments=[];
            if (this.state.cropStart > 0) {
                transcodeArguments.push("-ss");
                transcodeArguments.push(this.secondsToProgress(this.state.cropStart));
                this.setState({"startOffset":this.state.cropStart});
            }
            if (this.state.cropEnd > 0) {
                transcodeArguments.push("-t");
                let duration = this.secondsToProgress(this.state.cropEnd - this.state.cropStart);
                if (duration > this.props.audioMaxLength) duration = this.props.audioMaxLength;
                transcodeArguments.push(duration);
            }
            transcodeArguments = ["-i","input_"+that.state.fileName,"-vf","showinfo","-strict","-2"].concat(transcodeArguments);
            transcodeArguments.push(that.state.fileNameBase + ".mp3");
            console.log(['TC',transcodeArguments]);
            that.state.mp4Worker.postMessage({
              type: "run",
              arguments:transcodeArguments,
              MEMFS: [
                {
                  "name": "input_"+that.state.fileName,
                  "data": that.state.content
                }
              ],
            });            
        }
        
    };
    
    processMp3AudioLowQuality() {
        let that = this;
        that.setState({uploadField:'mp3lq',fileNameOut:this.state.fileNameBase + ".low.mp3",fileTypeOut:"audio/mp3",'uploadMessage':"Transcoding to MP3 Low Quality"});
        let transcodeArguments=[];
        if (this.state.cropStart > 0) {
            transcodeArguments.push("-ss");
            transcodeArguments.push(this.secondsToProgress(this.state.cropStart));
            this.setState({"startOffset":this.state.cropStart});
        }
        if (this.state.cropEnd > 0) {
            transcodeArguments.push("-t");
            let duration = this.secondsToProgress(this.state.cropEnd - this.state.cropStart);
            if (duration > this.props.audioMaxLength) duration = this.props.audioMaxLength;
            transcodeArguments.push(duration);
        }
        transcodeArguments = ["-i","input_"+that.state.fileName,"-vf","showinfo","-strict","-2","-ac","2","-b:a","48k","-ar","16000"].concat(transcodeArguments);
        transcodeArguments.push(that.state.fileNameBase + ".low.mp3");
        console.log(['TC',transcodeArguments]);
        that.state.mp4Worker.postMessage({
          type: "run",
          arguments: transcodeArguments,
          MEMFS: [
            {
              "name": "input_"+that.state.fileName,
              "data": that.state.content
            }
          ],
        });
    };
    
     startAudioPreview(f) {
        this.setState({workerQueue:['audioPreview']});
        this.handleProcessing();
        
    };
    startVideoPreview(f) {
        this.setState({workerQueue:['videoPreview']});
        this.handleProcessing();
        
    };
    
    processAudioPreview() {
        let that = this;
        that.setState({fileNameOut:this.state.fileNameBase + ".preview.mp3",fileTypeOut:"audio/mp3",'uploadMessage':"Transcoding to MP3 preview"});
        //"-ac","2","-abr","56",
        that.state.mp4Worker.postMessage({
          type: "run",
          arguments: ["-i","input_"+that.state.fileName,"-vf","showinfo","-strict","-2","-q:a","9","-ar","8000",that.state.fileNameBase + ".preview.mp3"],
          MEMFS: [
            {
              "name": "input_"+that.state.fileName,
              "data": that.state.content
            }
          ],
        });
    };
    
   
    processVideoPreview() {
        let that = this;
        let fileNameOut=that.state.fileNameBase + ".preview.mp4";
        let fileTypeOut="video/mp4";
        let file = new File([that.state.content],fileNameOut,{type:fileTypeOut});
        var reader  = new FileReader();
        reader.addEventListener("load", function (e) {
            
            that.setState({fileNameOut:fileNameOut,fileTypeOut:fileTypeOut,'uploadMessage':"Transcoding to MP4 video preview",'videoUrlPreview':e.target.result});
        }, false);
        reader.readAsDataURL(file);
             
        
        //"-t",this.state.maxDuration,
        //maxDuration:String(this.props.videoMaxLength)
        let transcodeArguments=[];
        transcodeArguments = ["-i","input_"+that.state.fileName,"-strict","-2","-preset","ultrafast","-q:a","9","-q:v","31"].concat(transcodeArguments);
        transcodeArguments.push(that.state.fileNameBase + ".preview.mp4");
        
        that.state.mp4Worker.postMessage({
          type: "run",
          arguments: transcodeArguments,
          MEMFS: [
            {
              "name": "input_"+that.state.fileName,
              "data": that.state.content
            }
          ],
        });
   
    };
    
    // image grab isn't part of either of the two kagami workers :(
    processImagePreview(file) {
        let that = this;
        that.clearForm();
        that.setState({uploadField:'png',fileNameOut:this.state.fileNameBase + ".png",fileTypeOut:"image/png"});
         this.resize(file, that.props.imageMaxWidth, that.props.imageMaxHeight, function (resizedDataUrl) { 
            that.setState({ imageUrlPreview: resizedDataUrl});
        });
    };
    
    // upload the file without transcoding
    processCopy() {   
        let that = this;
        let f = new File([that.state.content],that.state.fileName,{type: that.state.fileType})             
       this.uploadFile(f).then(function() {
           that.setState({'uploadMessage':"Uploading "+f.name})
            that.handleProcessing();
       });
    };
    
    updateExternalUrl(e) { 
        this.setState({'externalUrl':e.target.value});
        if (e.target.value && String(e.target.value).length > 0 && this.state.externalUrl !== e.target.value) {
            this.downloadAndConvert(e);
        }
    };
    
    cropImage(crop) {
        let that=this;
        let canvas = this.refs.cropper.getCroppedCanvas();
        if (canvas) {
            var arrayBuffer;
            var fileReader = new FileReader();
            fileReader.onload = function(event) {
                arrayBuffer = event.target.result;
                let content=new Uint8Array(arrayBuffer);
                that.setState({ imageUrl: canvas.toDataURL(), imageUrlPreview:null ,content:content})
                let file=new File([content],that.state.fileNameOut,{'type':that.state.fileTypeOut});
                that.uploadFile(file).then(function() {
                    console.log(['image ulaoded']);
                    that.setState({active:false,imageUrl:that.state.uploaded.png,uploadMessage:'Finished'});
                    //imageUrl:uploaded.png
                    that.props.onFinish(that.state.uploaded);            
                });
            };
            canvas.toBlob(function(blob) {
                fileReader.readAsArrayBuffer(blob);
            })
        }
    }
    
    isPreview() {
        if (this.state.imageUrlPreview || this.state.audioUrlPreview ||this.state.videoUrlPreview) {
            return true;
        } else return false;
    };
    
    previewPlay() {
        this._wavesurfer.play(this.state.cropStart,this.state.cropEnd);
    };
    
    progressToSeconds(progress) {
        var a = progress.split(':'); // split it at the colons
        var seconds = 0
        if (a.length===3) {
            seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]); 
        }
        return seconds;
    };
    
    secondsToProgress(progress) {
        let hours=parseInt(progress/3600,10);
        let minutes=parseInt(progress/60,10);
        let remainder = parseInt((progress - hours)*100,10)/100;
        let hoursString=(hours > 10) ? String(hours) : '0'+String(hours);
        let minutesString=(minutes > 10) ? String(minutes) : '0'+String(minutes);
        return hoursString+":"+minutesString+":"+String(remainder);
        //var date = new Date(null);
        //date.setSeconds(parseInt(progress)); // specify value for SECONDS here
        //let val= date.toISOString().substr(11, 8);
        //return val;
    };

    zoom(e) {
        if (this._wavesurfer) this._wavesurfer.zoom(e.target.value);
    };
 
    
    handleRegionChange(e) {
       // let el=this._getMediaSourceEl();
        if (this._wavesurfer.regions.list.One) {
            let options={};
            let newState={};
            let typeParts = this.state.fileType.split("/");
            let max=0;
            if (typeParts[0]=="audio") {
                max=parseFloat(this.props.audioMaxLength,10)
            } else if (typeParts[0]=="video") {
                max=parseFloat(this.props.videoMaxLength,10)
            }
            
            let oldRegion = this._wavesurfer.regions.list.One;
            //options[e.target.name]=e.target.value;
            if (e.target.name==="start") {
                //newState={cropStart:e.target.value}
                // shrink end to hold limit
                if (parseFloat(oldRegion.end,10) - parseFloat(e.target.value,10) > max) {
                    newState={cropStart:Math.round((parseFloat(oldRegion.end,10) - max)*100)/100}
                    options['start']=parseFloat(oldRegion.end,10) - max;
                } else {
                    newState={cropStart:Math.round(parseFloat(e.target.value,10)*100)/100}
                    options['start']=parseFloat(e.target.value,10);
                }
            } else if (e.target.name==="end") {
                // lift start to hold limit
                if (parseFloat(e.target.value,10) - parseFloat(oldRegion.start,10) > max) {
                    //newState={cropStart:parseFloat(e.target.value,10) - max}
                    options['end']=parseFloat(oldRegion.start,10) + max;
                    newState={cropEnd:Math.round((parseFloat(oldRegion.start,10) + max)*100)/100}
                } else {
                    options['end']=parseFloat(e.target.value,10);
                    newState={cropEnd:Math.round(parseFloat(e.target.value,10)*100)/100}
                }
            }
            
            this._wavesurfer.regions.list.One.update(options)   
            this.setState(newState); 
        }
      }

    
  render() {
     let video='';
      let audio='';
      let mediaElement='';
      if ((this.state.videoUrlMp4 || this.state.videoUrlWebm)) {
          video=(<video style={{width:"100%"}} controls ref={(c) => { this.mediaSourceEl = c; }} id="mediaplayer"  onTimeUpdate={this.handleMediaPosChange} onPlay={this.onCanPlay} >
          {!this.state.videoUrlPreview && this.state.videoUrlWebm && <source key='webm' src={this.state.videoUrlWebm}  />}
          {!this.state.videoUrlPreview && this.state.videoUrlMp4 && <source key='mp4' src={this.state.videoUrlMp4}  />}
          </video>)
      } else if ((this.state.audioUrlWebm || this.state.audioUrlMp3)) {
          audio=(<audio  style={{width:"100%"}}  controls ref={(c) => { this.mediaSourceEl = c; }} id="mediaplayer"   >
          {!this.state.audioUrlPreview && this.state.audioUrlWebm && <source key='webm' src={this.state.audioUrlWebm}  />}
          {!this.state.audioUrlPreview && this.state.audioUrlMp3 && <source key='mp3' src={this.state.audioUrlMp3}  />}
          {!this.state.audioUrlPreview && !this.state.audioUrlMp3 &&  this.state.audioUrlMp3lq && <source key='mp3lq' src={this.state.audioUrlMp3lq}  />}
          </audio>);
      } 
      let timelineOptions = {
          timeInterval: 0.5,
          height: 30,
          primaryFontColor: '#00f',
          primaryColor: '#00f'
        };
        
       
      let progressWidth=this.state.mediaProgress ? (parseInt(this.state.mediaProgress,10) < 100 ? parseInt(this.state.mediaProgress,10) : 100) +'%' : '0%';
      return (
      <div>
        {!this.isWorkerLoaded() && <img alt='loading' src="/loading.gif"  style={{width:'30px'}} />}
        
        {(this.isPreview() || this.state.active) && <span>&nbsp;&nbsp;<button style={{float:'right'}}  onClick={this.stopUpload} >Cancel</button></span>}
        
        {this.state.uploadMessage && <span>&nbsp;&nbsp;{this.state.uploadMessage}<br/><br/></span>} 
        
        {this.state.active && <span><div className='progressbar' style={{backgroundColor: 'blue',width: '100%'}}><div className='progressbarinner' style={{backgroundColor: 'red', width:progressWidth}} >&nbsp;</div></div><br/></span>}
        
        
        {!(this.isPreview()|| this.state.active) && this.isWorkerLoaded() && <span><b>URL</b> <input size="100" type='text' onBlur={this.updateExternalUrl} defaultValue='' /><br/>or <input type="file" onChange={this.onChange} accept={this.props.acceptFileTypes} /></span>}
    
        
        {this.state.imageUrlPreview &&  <span><span>&nbsp;&nbsp;<button style={{float:'right'}}  onClick={this.cropImage} >Crop and Upload</button></span>
        <br/><br/><br/><Cropper
        ref='cropper'
        src={this.state.imageUrlPreview}
        style={{height: 600,width:'100%'}}
        autoCropArea={1}
        // Cropper.js options
        guides={false}
        />
        
        </span>
        }
        <br/>
         {(this.state.audioUrlPreview || this.state.videoUrlPreview) && <div className="row">
          <div className="form-group media-preview">
            <label htmlFor="region-start"><b>Crop</b>&nbsp;&nbsp;&nbsp;Start:</label>
            <input
              name="start"
              type="number"
              step="0.02"
              className="form-control prop-value"
              value={this.state.cropStart}
              onChange={this.handleRegionChange}
              style={{width: '8em'}}
            />
            <label htmlFor="region-end">&nbsp;&nbsp;&nbsp;End:</label>
            <input
              name="end"
              type="number"
              className="form-control prop-value"
              step="0.02"
              value={this.state.cropEnd}
              onChange={this.handleRegionChange}
              style={{width: '8em'}}
            />
            {(this.state.audioUrlPreview || this.state.videoUrlPreview) &&  <span>&nbsp;&nbsp;<button style={{float:'right'}}  onClick={this.crop} >Crop and Upload</button>&nbsp;&nbsp;<button style={{float:'right'}}  onClick={this.previewPlay} >Preview</button></span>}
          </div>
        </div>}
        
        {<div style={{marginLeft:'0.5em',marginRight:'0.5em'}}><div id={"wave-timeline"+this.props.name} ></div>
            {(this.state.audioUrlPreview || this.state.videoUrlPreview) && <label><b>Zoom&nbsp;&nbsp;&nbsp;</b> <input data-action="zoom" type="range" min="1" max="200" defaultValue="0" style={{width:'80%'}} className="form-control prop-value"
               onInput={this.zoom} /></label>}
            <div id={"waveform"+this.props.name} ></div>
            
            <div id={"wavemedia"+this.props.name} ></div>
            </div>
        }
         
        {this.state.imageUrl && <img alt='uploaded' src={this.state.imageUrl}  />}
        {audio}
        {video}
      
      </div>);
  }
 

}

     
MediaFileUpload.defaultProps ={
            preprocess: function(file, next) {
                console.log('Pre-process: ' + file.name);
                next(file);
            },
            onSignedUrl: function( signingServerResponse ) {
                console.log('Signing server response: ', signingServerResponse);
            },
            onProgress: function(percent, message) {
                console.log('Upload progress: ' + percent + '% ' + message);
            },
            onFinish: function(signResult) {
                console.log(["Upload finished: " , signResult])
            },
            onError: function(message) {
                console.log("Upload error: " + message);
            },
            server: '',
            signingUrlMethod: 'GET',
            scrubFilename: function(filename) {
                if (filename) {
                    return filename.replace(/[^\w\d_\-\.]+/ig, '');
                } else {
                    return 'unknownFile';
                }
                
            },
            
            s3path: '',
            fileSizeLimit: 50*1048576,  // 50M
            autoUpload: true,
            imageMaxWidth: 1024,
            imageMaxHeight: 768,
            audioMaxLength: 90,
            videoMaxLength:  20,
            publicUrlPrefix: "", ///api"  // to allow for s3 routes added underneath express app path,
            signingUrlMethod:"GET",
            autoUpload:true,
            signingUrlWithCredentials:true,
            uploadRequestHeaders:{ 'x-amz-acl': 'public-read' } ,
            contentDisposition:"auto",
            acceptFileTypes:"audio/*,video/*,image/*"
            
        };

export default MediaFileUpload;

