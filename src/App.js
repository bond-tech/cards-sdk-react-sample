import {useEffect, useState, useRef, useCallback} from 'react';
import SDK from './sdk';
import './App.css';
import Dialog from './components/Dialog';

const INITIAL_RESULT_TEXT = 'Submit a form to see result.';

const sdk = new SDK({live: false});

function App() {
    const [isOpen, setOpen] = useState(false);
    const [result, setResult] = useState(INITIAL_RESULT_TEXT);
    const currentPinRef = useRef(null);
    const ccNewPinRef = useRef(null);
    const ccConfirmPinRef = useRef(null);

    const handleClose = () => {
        setOpen(!isOpen);
        setResult(INITIAL_RESULT_TEXT);
    }

    useEffect(() => {
        isOpen && sdk
            .field({
                selector: '#cc-current-pin',
                type: 'current_pin',
                disabled: false,
                successColor: '#4F8A10',
                errorColor: '#D8000C',
                placeholder: '1234',
                hideValue: true,
            })
            .then(data => {
                console.log(data)
            })
            .catch((error) => {
                console.error('error', error);
            });
    }, [isOpen, currentPinRef])

    useEffect(() => {
        isOpen && sdk
            .field({
                selector: '#cc-new-pin',
                type: 'new_pin',
                successColor: '#4F8A10',
                errorColor: '#D8000C',
                placeholder: '5678',
                hideValue: true,
            })
            .then(data => {
                console.log(data)
            })
            .catch((error) => {
                console.error('error', error);
            });
    }, [isOpen, ccNewPinRef])

    useEffect(() => {
        isOpen && sdk
            .field({
                selector: '#cc-confirm-pin',
                type: 'confirm_pin',
                successColor: '#4F8A10',
                errorColor: '#D8000C',
                placeholder: '5678',
                hideValue: true,
            })
            .then(data => {
                console.log(data)
            })
            .catch((error) => {
                console.error('error', error);
            });
    }, [isOpen, ccConfirmPinRef])

    const onSubmit = useCallback(() => {
        if (isOpen) {
            sdk.submit({
                cardId: process.env.REACT_APP_CARD_ID,
                identity: process.env.REACT_APP_IDENTITY,
                authorization: process.env.REACT_APP_AUTHORIZATION,
                currentPin: currentPinRef?.current?.value,
                newPin: ccNewPinRef?.current?.value,
                confirmPin: ccConfirmPinRef?.current?.value,
                successCallback: function (status, data) {
                    console.log(status, data);
                    setResult(`card_id @ service: ${data.card_id}<br/>
  pin_changed @ service: ${data.pin_changed}<br/>`);
                },
                errorCallback: function (errors) {
                    setResult(errors);
                },
            });
        }
    }, [isOpen, currentPinRef, ccNewPinRef, ccConfirmPinRef]);


    return (
        <div className='App'>
            <button className='button' onClick={handleClose}>Open dialog</button>
            {isOpen && <Dialog onClose={() => setOpen(false)}>
                <div id='cc-form'>
                    <div className='field'>
                        Current PIN
                        <div id='cc-current-pin' className='card-field'/>
                    </div>
                    <div className='field'>
                        New PIN
                        <div id='cc-new-pin' className='card-field'/>
                    </div>
                    <div className='field'>
                        Conrfim New PIN
                        <div id='cc-confirm-pin' className='card-field'/>
                    </div>
                    <div>
                        <h5 className='text-center'>Response</h5>
                        <div id='result' dangerouslySetInnerHTML={{__html: result}}/>
                    </div>
                    <button id='submit' className='button button--full-width' onClick={onSubmit}>
                        Set PIN
                    </button>
                </div>
            </Dialog>}
        </div>
    );
}

export default App;
