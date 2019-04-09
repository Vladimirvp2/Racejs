import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';

// Main styles of the popup dialog
const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
	textAlign: 'center'		
  }
};


// Bind component
Modal.setAppElement('#popup')

/* Result popup with such info as score, total distance, max/avg speed */ 
class Popup extends React.Component {
	constructor() {
		super();
	
		this.afterOpenModal = this.afterOpenModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
	}
 
	afterOpenModal() {
		// references are now sync'd and can be accessed.
		this.subtitle.style.color = '#f00';
	}
 
	closeModal() {
		this.props.closeF();
	}
 
	render() {
		return (
			<div>
				<Modal
					isOpen={this.props.show}
					onAfterOpen={this.afterOpenModal}
					onRequestClose={this.closeModal}
					style={customStyles}
					contentLabel="Out of fuel" >
 
					<h2 ref={subtitle => this.subtitle = subtitle} className="customPopupHeaderText">Out of fuel</h2>
					<div className="customPopupStyleText">Total distance covered: {this.props.distance.toFixed(2)} km</div>
					<div className="customPopupStyleText">Max speed: {this.props.maxspeed.toFixed(2)} km/h</div>
					<div className="customPopupStyleText">Average speed: {this.props.avgspeed.toFixed(2)} km/h</div>
					<div className="customPopupStyleText">Score: {this.props.points.toFixed(0)} points</div>			  
					<button className="buttonStyle" onClick={this.closeModal}>Close</button>		  
				</Modal>
			</div>
		);
	}
}

export default Popup;