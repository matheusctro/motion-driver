/**
 * This protocol use a header of 1 byte, 32 bits with field mask and a 1 byte checksum.
 * This protocol is master-slave, which this controller is slave and only send info when the master required.
 * The commands are three types: CONTROL, PROGRAM and RUN
 * The header is the ASCII caracter '>', that in hex has value 0x3E
 * The 32 bits field data is defined like:
 *      Required (MASTER -> SLAVE):
 *          CONTROL
 *              LOAD : MOTION : 0 : 0
 *                  Load from the flash a respective MOTION to the BUFFER
 *              EXECUTE : OPCODE1 : OPCODE0 : 0
 *                  Execute the command on the interpreter. If the MODE is 0x00 the command is the operation composed by OPCODE1 and OPCODE0
 *                  If the MODE is 0x01 the command is the STEP on the motion load on the BUFFER
 *              SET_PARAM : PARAM : VALUE1 : VALUE0
 *                  Write on FLASH the VALUE on the selected PARAM
 *          PROGRAM MODE
 *              WRITE : STEP : OPCODE1 : OPCODE0
 *                  Write the operation composed by the OPCODE1 and OPCODE2 on the specific STEP into the BUFFER
 *              UPDATE : 0 : 0 : 0
 *                  Store on the flash the MOTION on the BUFFER
 *              READ : STEP : 0 : 0
 *                  Read a specific STEP on MOTION storage on BUFFER
 *          RUN MODE
 *              RUN : MOTION : 0 : 0
 *                  Start the running on the selected MOTION
 *              STOP : 0 : 0 : 0
 *                  Stop immediately the motion running
 *              ACK : 0 : 0 : 0
 *                  Get the status of the controller
 *
 *      Response (SLAVE -> MASTER)
 *          LOAD : REPONSE : STATUS : MOTION
 *              Return the STATUS of the controller and the loaded MOTION
 *          EXECUTE : REPONSE : STATUS : MOTION
 *              Return the STATUS of the controller and the loaded MOTION
 *          WRITE : REPONSE : STATUS : MOTION
 *              Return the STATUS of the controller and the loaded MOTION
 *          UPDATE : REPONSE : STATUS : MOTION
 *              Return the STATUS of the controller and the loaded MOTION
 *          READ : REPONSE : OPCODE1 : OPCODE0
 *              Return the STATUS of the controller and the operation readed composed by OPCODE1 and OPCODE0
 *          RUN : REPONSE : STATUS : MOTION
 *              Return the STATUS of the controller and the loaded MOTION
 *          STOP : REPONSE : STATUS : MOTION
 *              Return the STATUS of the controller and the loaded MOTION
 *          ACK : REPONSE : STATUS : MOTION
 *              Return the STATUS of the controller and the loaded MOTION
 * The value of the field has the following values:
 *      COMMANDS
 *          0xA1 - LOAD
 *          0xA2 - EXECUTE
 *          0xA3 - SET_PARAM
 *          0xA4 - WRITE
 *          0xA5 - UPDATE
 *          0xA6 - READ
 *          0xA7 - RUN
 *          0xA8 - STOP
 *          0xA9 - ACK
 *          0xE0 - ERRO COMMAND
 *      PARAM
 *          0x00 - (to define...)
 *      STATUS
 *          0x00 - IDLE/OK
 *          0x01 - RUNNING
 *          0x02 - PROGRAMING
 *      RESPONSE
 *          0xC0 - COMMAND OK
 *          0xE0 - ERRO COMMAND
 *          0xE1 - INTERPRETER BUSY
 *          0xE2 - FLASH ERROR
 *
 * Obs.:
 * The process of the write must be done by send the LOAD command, WRITE command to change the steps and finish with UPDATE command.
 * The protocol is equal independent of the communication mode.
 * Initialy this controller has 2 mode: CAN and Serial
 * When the command has sended wich function received has received, parser and send to comProtocol to execute the command
 *
 * The functions of the comProtocol is:
 *      - parser data: verify if the received data has the right header and the cheksum is correct
 *      - decode command: verify wich command and extract the params
 *      - encode: add a header and calcule the checksum
 *      - execute:  received raw data,
 *                  call the parser,
 *                  decode command,
 *                  call the function command,
 *                  encode response
 *                  call callback to transmit
 *
 */

const LOADcmd = 0xA1;
const EXECUTEcmd = 0xA2;
const SET_PARAMcmd = 0xA3;
const WRITEcmd = 0xA4;
const UPDATEcmd = 0xA5;
const READcmd = 0xA6;
const RUNcmd = 0xA7;
const STOPcmd = 0xA8;
const ACKcmd = 0xA9;

function interpreter(CMD){

}
