import React from 'react'
import ReactHowler from 'react-howler'
import raf from 'raf' // requestAnimationFrame polyfill
import Button from './Button'
import './Player.css'
import { Col } from 'react-bootstrap'

class FullControl extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      playing: false,
      timerOn: false,
      timerStart: 0,
      timerTime: 0,
      loaded: false,
      loop: false,
      mute: false,
      volume: 1.0,
      location : 0,
      twentyFive: 0,
      duration: 0,
      secCount: 0,
      //autoplay: true,
      //html5: true,
      //preload: true,  
      format: ['ogg','webm','mp3']
    }
    this.handleToggle = this.handleToggle.bind(this)
    this.handleOnLoad = this.handleOnLoad.bind(this)
    this.handleOnEnd = this.handleOnEnd.bind(this)
    this.handleOnPlay = this.handleOnPlay.bind(this)
    this.handleStop = this.handleStop.bind(this)
    this.renderSeekPos = this.renderSeekPos.bind(this)
    this.handleLoopToggle = this.handleLoopToggle.bind(this)
    this.handleMuteToggle = this.handleMuteToggle.bind(this)
    // this.registerClick = this.registerClick.bind(this)  //------------------------1------------------------------
    
  }

  componentWillUnmount () {
    this.clearRAF()
  }

  //----------------------------2---------------------------
  //better method but still gives same error
  componentDidMount(){
    this.registerClickLIFE()
    
  }

  handleToggle () {
    this.setState({
      playing: !this.state.playing
    },()=>{
      if(this.state.playing){
        this.startTimer()
      }
      else{
        this.stopTimer()
      }
    })
  }

  startTimer(){
    this.setState({
      timerOn: true,
      timerTime: this.state.timerTime,
      timerStart: Date.now() - this.state.timerTime
    });
    this.timer = setInterval(() => {
      this.setState({
        timerTime: Date.now() - this.state.timerStart
      }
      ,()=>{
        if(this.state.timerTime === 2000){
          console.log('equal bhayo')
        }
      }
      )
    }, 10)
  }

  stopTimer(){
    this.setState({ timerOn: false })
    clearInterval(this.timer)
  }

  handleOnLoad () {
    this.setState({
      loaded: true,
      duration: this.player.duration(),
      twentyFive: this.player.duration() * .25
    })
  }

  handleOnPlay () {
    this.setState({
      playing: true
    })
    this.renderSeekPos()
  }

  handleOnEnd () {
    this.setState({
      playing: false
    })
    this.clearRAF()
    this.props.togglePlayStatus()
  }

  handleStop () {
    this.player.stop()
    this.setState({
      playing: false // Need to update our local state so we don't immediately invoke autoplay
    })
    this.renderSeekPos()
  }

  handleLoopToggle () {
    this.setState({
      loop: !this.state.loop
    })
  }

  handleMuteToggle () {
      console.log('mute')
    this.setState({
      mute: !this.state.mute
    })
  }

  renderSeekPos () {
    this.setState({
      seek: this.player.seek()
    })
    if (this.state.playing) {
      this._raf = raf(this.renderSeekPos)
    }
  }
  

  updateSeekBar() {
    var fillBar = document.getElementById('fill');
    fillBar.style.width = (this.state.seek/this.state.duration) * 100 + '%'
    
  }
      

// this was my first method of seeking and gives warning cannot update message 
//---------------------------------------1----------------------------------
// registerClick(){
//   console.log('pressed')
//     var progressBar = document.getElementById('progress')
//     var titleBar = document.getElementById('title')
//     var elapsedtimeBar = document.getElementById('elapsedtime')
//     var location =2
//     let self = this
//     console.log('value of self is', self)
//       progressBar.addEventListener('click', function (event) {
//         var pressedDistance = event.clientX-(titleBar.clientWidth + elapsedtimeBar.clientWidth)
//         location = pressedDistance/ progressBar.clientWidth
//         console.log('variable location is', location)
//         if(location ===2){
//           console.log('location is 2 ')
//         } else {
//           console.log('location is !2 ')
//           self.setState({location: location},()=>{
//             // self.seekTo(self.state.location)
//           })
//         }
//   })
// }
//---------------------------------1-------------------------------------------
//----------------------------------2----------------------------
//Better method of seeking but still yeilds same error
  registerClickLIFE(){
    var progressBar = document.getElementById('progress')
    var titleBar = document.getElementById('title')
    var elapsedtimeBar = document.getElementById('elapsedtime')
    var location =2
    let self = this
    // console.log('value of self is', self)
    progressBar.addEventListener('click', function (event) {
      var pressedDistance = event.clientX-(titleBar.clientWidth + elapsedtimeBar.clientWidth)
      location = pressedDistance/ progressBar.clientWidth
      self.setState({location: location})
    })
  }
//-----------------------------------2----------------------------------

  seekTo(location){
    location = this.state.location
    this.setState({location: 0})
    this.player.seek(this.player.duration()*location)
    console.log('toseek called')
  }
    
  clearRAF () {
    raf.cancel(this._raf)
  }

  render () {
    const { timerTime } = this.state;
    let centiseconds = ("0" + (Math.floor(timerTime / 10) % 100)).slice(-2);
    let seconds = ("0" + (Math.floor(timerTime / 1000) % 60)).slice(-2);
    let minutes = ("0" + (Math.floor(timerTime / 60000) % 60)).slice(-2);
    let hours = ("0" + Math.floor(timerTime / 3600000)).slice(-2);
    return (
      <div className='full-control'>
        <div className="Stopwatch-display">
            {hours} : {minutes} : {seconds} : {centiseconds}
        </div>
        <ReactHowler
            src={this.props.howlSource}
            format={this.state.format}
            playing={this.state.playing}
            onLoad={this.handleOnLoad}
            onPlay={this.handleOnPlay}
            onEnd={this.handleOnEnd}
            loop={this.state.loop}
            mute={this.state.mute}
            volume={this.state.volume}
            ref={(ref) => (this.player = ref)}
        />
                    <div id="bhado">
                        <div id="title">
                           <div id="icon">
                          
                           </div>
                           <div id="songinfo">
                                <div id="upper">
                                    <span>Song name</span>
                                </div>
                                <div id="lower">
                                    <span>Artist name(s)</span>
                                </div>
                           </div>
                           <div id="favbutton">
                                FAv Icon
                           </div>
                        </div>

                        <div id="progressbar">
                            <div id="upper_section">
                                <div id="five0">
                                    <label>
                                        Loop:
                                        <input
                                        type='checkbox'
                                        checked={this.state.loop}
                                        onChange={this.handleLoopToggle}
                                        />
                                    </label>
                                </div>
                                <div id="five1" >
                                    Previous track
                                </div>
                                <div id="five2">
                                    <Button onClick={this.handleToggle}>
                                        {(this.state.playing) ? 'Pause' : 'Play'}
                                    </Button>
                                </div>
                                <div id="five3">
                                    Next Track
                                </div>
                                <div id="five4">
                                    Shuffle
                                </div>
                            </div>
                            <div id="lower_section">
                                <div id="elapsedtime">
                                    {(this.state.seek !== undefined) ? this.state.seek.toFixed(1) : '0.0'}
                                </div>
                                <div id="progress" 
                                // onMouseEnter={this.registerClick} //-----------------------1-------------------------------
                                >
                                 
                                    <div id="seek_bar" >
                                        <div id="fill">
                                          {(this.state.playing === true) ? this.updateSeekBar()  : null}
                                          {/* {(this.state.playing === true) ? this.registerClick()  : null} */}
                                          {(this.state.playing === true ) && this.state.location !== 0 ? this.seekTo(this.state.location) : null}
                                        </div>
                                        <div id="handle"></div>
                                    </div>    
                                </div>
                                <div id="totaltime">
                                    {(this.state.duration) ? this.state.duration.toFixed(1) : 'NaN'}
                                </div>
                            </div>
                        </div>
                        
                        <div id="volumebar">
                            <label id="vollabel">
                                <span 
                                    id="mute"
                                    onClick={ this.handleMuteToggle}>       
                                    {this.state.mute ? 'Volume muted' : 'Volume'}                                  
                                </span>
                                <span className='slider-container'>
                                  <input
                                      id="bar"
                                      type='range'
                                      min='0'
                                      max='1'
                                      step='.05'
                                      value={this.state.volume}
                                      onChange={e => this.setState({volume: parseFloat(e.target.value)})}
                                  />
                                </span>
                                
                            </label>
                          </div>
                        
                    </div>
      </div>
    )
  }
}

export default FullControl