import React, {Component} from 'react';

/* Gear component. It has only 1 property: gear */
class GearIndicator extends Component{
	constructor(props) {
		super(props);				
	}
	
	shouldComponentUpdate(nextProps, nextState){
		if(nextProps.gear == this.props.gear){
			return false;
		}
		
		return true;
	}	
		
	render(){
		return(
			<div className="inline">		
				<div className="gear-indicator-wrap">			
					<span className="gear-text">{ this.props.gear }</span>
				</div>				
			</div>
		);
	}
}

export default GearIndicator;