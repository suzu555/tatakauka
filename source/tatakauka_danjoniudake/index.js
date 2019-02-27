/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core'); //��ʓI�Ƀ��W���[�������ꂽJavaScript�t�@�C����ǂݍ��ނ��߂ɗp�����܂��B

//=========================================================================================================================================
//TODO: ���̃R�����g�s��艺�̍��ڂɒ��ڂ��Ă��������B
//=========================================================================================================================================
const SKILL_NAME = "�키��";
const GET_FACT_MESSAGE = "�키���̌��t��";
const HELP_MESSAGE = "�키���𕷂��������́u�키���v�ƁA�I��肽�����́u�����܂��v�ƌ����Ă��������B�ǂ����܂����H";
const HELP_REPROMPT = "�키�����ǂ����܂����H";
const FALLBACK_MESSAGE = "����ɂ��Ă͂킩��܂���B�키���𕷂��������́u�키���v�ƁA�I��肽�����́u�����܂��v�ƌ����Ă��������B�ǂ����܂����H";
const FALLBACK_REPROMPT = "�키�����ǂ����܂����H";
const STOP_MESSAGE = "�O�b�o�C";

//=========================================================================================================================================
//�uTODO: �������牺�̃f�[�^�������p�ɃJ�X�^�}�C�Y���Ă��������B�v
//=========================================================================================================================================
const data = [
    "�����̈�N�͂�����88���ł��B",
    "�����͐����Ɣ�ׂđ��z��艓���ɂ���܂����A�C���͐������������ł��B",
    "�����͔����v���Ɏ��]���Ă��܂��B�ߋ��ɋN������覐΂̏Փ˂������ƌ����Ă��܂��B",
    "�ΐ��ォ�猩��ƁA���z�̑傫���͒n�����猩���ꍇ�̖񔼕��Ɍ����܂��B",
    "�ؐ���<sub alias='�����ɂ�'>1��</sub>�͑S�f���̒��ň�ԒZ���ł��B",
    "�V�̐��͖͂�50���N��ɃA���h�����_���_�ƏՓ˂��܂��B",
    "���z�̎��ʂ͑S���z�n�̎��ʂ�99.86%���߂܂��B",
    "���z�͂قڊ����ȉ~�`�ł��B",
    "�F�����H�͈�N�����N�Ɉ�x�����������Ȃ��������o�����ł��B",
    "�y���͎��g�����z����󂯂�G�l���M�[��2.5�{�̃G�l���M�[���F���ɕ��o���Ă��܂��B",
    "���z�̓������x�͐ێ�1500���x�ɂ��B���܂��B",
    "���͖��N3.8cm�n�����痣��Ă����Ă��܂��B"
];

//=========================================================================================================================================
//���̍s���牺�̃R�[�h�ɕύX��������ƁA�X�L�������삵�Ȃ��Ȃ邩������܂���B�킩��l�̂ݕύX�������Ă��������B  
//=========================================================================================================================================
function getRandomItem(arrayOfItems) { //�A�C�e���̏��ԗ�R���e�i�̗����Ŏ��o���֐�
    // can take an array, or a dictionary
    if (Array.isArray(arrayOfItems)) { //�z��̏ꍇ�̓g���[�A�I�u�W�F�N�g�̓t�F�[���X
        // the argument is an array []
        let i = 0; //let ���̓u���b�N�X�R�[�v�̋Ǐ��ϐ���錾���܂��B�C�ӂŒl�������ď������ł��܂��B
        i = Math.floor(Math.random() * arrayOfItems.length); //�A�C�e������0.0-1.0���|���Čv�Z�����������o��i�ɓ����
        return (arrayOfItems[i]); //�A���C�̃A�C�e����i��0����A���C�A�C�e���̐��̂ǂꂩ��Ԃ�
    }

    if (typeof arrayOfItems === 'object') { //typeof ���Z�q�̓f�[�^�^�������������Ԃ��܂����A�傫�ȂЂƂ�����Ƃ��Ă̌^�Ȃ̂Ō����Ȍ^���肪�ł��Ȃ��̂͂����m���Ǝv���܂��B//�o�p�����́H�I�u�W�F�N�g�������ꍇ�A�l�[���v���p�e�B��ǂ݁A��̏��������g���A���b�Z�[�W���o��
        // argument is object, treat as dictionary
        const result = {}; //���������
        const key = this.getRandomItem(Object.keys(arrayOfItems)); //Object.keys() ���\�b�h�́A�w�肳�ꂽ�I�u�W�F�N�g������ names �v���p�e�B�̔z����A�ʏ�̃��[�v�Ŏ擾����̂Ɠ��������ŕԂ��܂��B�����āA���̊֐��̃����_���ɑ���t����
        result[key] = arrayOfItems[key]; //result�ɃA���C�A�C�e���̃��b�Z�[�W������ 
        return result; //���b�Z�[�W��Ԃ�
    }
    // not an array or object, so just return the input
    return arrayOfItems; //���������Ȃ�A���C�̃A�C�e��������
}

//����֐��̃��C���̖{��𒝂�֐�
const GetNewFactHandler = {
    canHandle(handlerInput) { //�g���[��Ԃ���
        const request = handlerInput.requestEnvelope.request; //�n���h���[�̊��ϐ��̑���Ԃ��A���N�G�X�g�ɓ����
        return request.type === 'LaunchRequest' //1��Ԃ��Ă���
            || (request.type === 'IntentRequest' //1��Ԃ��Ă���
                && request.intent.name === 'GetNewFactIntent'); //1��Ԃ��Ă���
    },
    handle(handlerInput) { //����ׂ̎��s�֐�
        const randomFact = getRandomItem(data); //���b�Z�[�W�f�[�^��ϐ��ɓ����
        const speechOutput = GET_FACT_MESSAGE + randomFact; //�����������Ē��镶�������

        return handlerInput.responseBuilder //�����𐶐��A�r���_�[����
            .speak(speechOutput) //���点��
            .withSimpleCard(SKILL_NAME, randomFact) //��������ʂɏo��
            .reprompt(HELP_REPROMPT) //reprompt()�ł́A���[�U�[����̕Ԏ����Ȃ��������̔��b���w��ł��܂��B
            .getResponse(); //getResponse()�ŁA�o���オ�������X�|���X���擾���āA�n���h���̖߂�l�Ƃ��Ďg�p���܂��B
    },
};
//����֐��̃��C���̖{��𒝂�֐�
const DanjonSpeakHandler = {
    canHandle(handlerInput) { //�g���[��Ԃ���
        const request = handlerInput.requestEnvelope.request; //�n���h���[�̊��ϐ��̑���Ԃ��A���N�G�X�g�ɓ����
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'orderIntent';
    },
    handle(handlerInput) { //����ׂ̎��s�֐�
        const speechOutput = "�_���W�������n�߂悤"; //�����������Ē��镶�������

        return handlerInput.responseBuilder //�����𐶐��A�r���_�[����
            .speak(speechOutput) //���点��
            .withSimpleCard("danjon", "danjon") //��������ʂɏo��
            .reprompt(HELP_REPROMPT) //reprompt()�ł́A���[�U�[����̕Ԏ����Ȃ��������̔��b���w��ł��܂��B
            .getResponse(); //getResponse()�ŁA�o���オ�������X�|���X���擾���āA�n���h���̖߂�l�Ƃ��Ďg�p���܂��B
    },
};
const HelpHandler = { //�w���v�֐��n���h���[
    canHandle(handlerInput) { //1��Ԃ���
        const request = handlerInput.requestEnvelope.request; //�l�̎��o��
        return request.type === 'IntentRequest' //1���o��
            && request.intent.name === 'AMAZON.HelpIntent'; //1�o����
    },
    handle(handlerInput) { //���郁�C���֐�
        return handlerInput.responseBuilder //�߂�l��Ԃ���
            .speak(HELP_MESSAGE) //�w���v������ׂ��
            .reprompt(HELP_REPROMPT) //reprompt()�ł́A���[�U�[����̕Ԏ����Ȃ��������̔��b���w��ł��܂��B
            .getResponse(); //�n���h����Ԃ�
    },
};

const FallbackHandler = { //�C�O�p����Ȃ������H�H
    // 2018-May-01: AMAZON.FallackIntent is only currently available in en-US locale.
    //              This handler will not be triggered except in that locale, so it can be
    //              safely deployed for any locale.
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest'
            && request.intent.name === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak(FALLBACK_MESSAGE)
            .reprompt(FALLBACK_REPROMPT)
            .getResponse();
    },
};

const ExitHandler = { //��b���~�߂鎞�p
    canHandle(handlerInput) { //1��Ԃ�
        const request = handlerInput.requestEnvelope.request; //���ϐ���Ԃ�����
        return request.type === 'IntentRequest' //1��Ԃ���
            && (request.intent.name === 'AMAZON.CancelIntent' //1��Ԃ���
                || request.intent.name === 'AMAZON.StopIntent'); //1��Ԃ���
    },
    handle(handlerInput) { //�n���h���֐�
        return handlerInput.responseBuilder //�n���h���̕Ԃ��֐��쐬
            .speak(STOP_MESSAGE) //��b���~�߂鎞�̃��b�Z�[�W
            .getResponse(); //�n���h����Ԃ�
    },
};

const SessionEndedRequestHandler = { //SessionEndedRequest����M������͉����A�J�[�h�A�f�B���N�e�B�u���g����������Ԃ����Ƃ͂ł��܂��񂪁A�N���[���A�b�v���W�b�N��ǉ�����ɂ�SessionEndedRequest�n���h���[���œK�ȏꏊ�ł�
    canHandle(handlerInput) { //1��Ԃ���
        const request = handlerInput.requestEnvelope.request; //���e�ϐ��𑩂ŕԂ�
        return request.type === 'SessionEndedRequest'; //1��Ԃ���
    },
    handle(handlerInput) { //�n���h�����s����ƁH�H
        console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`); //�R���\�[���Ƀ��b�Z�[�W�\��

        return handlerInput.responseBuilder.getResponse(); //�n���h���[��Ԃ�
    },
};

const ErrorHandler = { //ASK SDK v2 for Node.js�̓G���[�������ȒP�ŁA�X���[�Y�ȃ��[�U�[�G�N�X�y���G���X����������X�L�����쐬���₷���Ȃ�܂��B�G���[�n���h���[�́A�������̃��N�G�X�g��API�T�[�r�X�̃^�C���A�E�g�Ȃǂ̃G���[�������W�b�N��g�ݍ��ނ̂ɍœK�ł��B�ȉ��̗�ł́Acatch all�G���[�n���h���[���X�L���ɒǉ����āA���ׂẴG���[�ɑ΂��ăX�L�����Ӗ��̂��郁�b�Z�[�W��Ԃ��悤�ɂ��Ă��܂��B
    canHandle() { //����󂯂�̖����ē���Ȃ��ėǂ���
        return true; //1��Ԃ�����
    },
    handle(handlerInput, error) { //�n���h���̎��s����
        console.log(`Error handled: ${error.message}`); //�R���\�[���ɃG���[���b�Z�[�W�����邾��

        return handlerInput.responseBuilder //�n���h���[�̃��X�|���X��Ԃ�
            .speak('Sorry, an error occurred.') //����
            //        .reprompt('Sorry, an error occurred.') //�����Ē���
            .getResponse(); //�n���h����Ԃ�
    },
};

const skillBuilder = Alexa.SkillBuilders.custom(); //SkillBuilder�̓X�L���̍쐬�A���[�U�[�G�[�W�F���g�̃J�X�^�}�C�Y�ALambda�����n���h���[�̍쐬�ɖ𗧂֐���񋟂��܂��B

exports.handler = skillBuilder //�܂��A�Ăяo����鑤�̃t�@�C���ŁA���W���[��������l��I�u�W�F�N�g��exports���Ă����B�������邱�ƂŁA���̒l��I�u�W�F�N�g�ɊO������A�N�Z�X���邱�Ƃ��\�ɂȂ�B
    .addRequestHandlers( //(�W�������̒ǉ�)
        GetNewFactHandler, //����֐�����ˁH
        DanjonSpeakHandler, //����֐�
        HelpHandler, //�w���v�֐��̏o��
        ExitHandler, //�I���֐��̏o��
        FallbackHandler, //�ł��D�揇�ʂ̒Ⴂ���N�G�X�g�n���h��
        SessionEndedRequestHandler //�Ȃ񂩂˒���炵���֐��̏o��
    )
    .addErrorHandlers(ErrorHandler) //�G���[�n���h���[�̏o��
    .lambda(); //����̎��s���H
