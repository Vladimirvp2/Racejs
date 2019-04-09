import React, {Component} from 'react';
import {NEEDLE_ANGLE_RANGE_TACH, NEEDLE_ZERO_ANGLE_TACH, MAX_REVOLUTIONS } from './../logic/config';

/* Tachometer component. It has such props as rev */
class Tachometer extends Component{
	constructor(props) {
		super(props);				
	}
	
	shouldComponentUpdate(nextProps, nextState){
		if(nextProps.rev == this.props.rev){
			return false;
		}
		
		return true;
	}	
	
	/* 
	 * Calculate the correct angle of the needle
	 * @return int angle	
	*/	
	getAngle( rev ) {
		return  rev * NEEDLE_ANGLE_RANGE_TACH / MAX_REVOLUTIONS + NEEDLE_ZERO_ANGLE_TACH;
	}	
		
	render(){
		// apply calculated angle depending on the current speed	
		var needleStyle = {
			transform: `rotate(${this.getAngle(this.props.rev)}deg)`
		};	
		return(
			<div className="inline">		
				<div className="tachometer-wrap">			
					<div className="inner-meter"><span style={needleStyle} className="needle"></span></div>
				</div>				
			</div>
		);
	}
}

export default Tachometer;