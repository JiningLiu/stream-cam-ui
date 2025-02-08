/* eslint-disable @typescript-eslint/no-explicit-any */
import { v4 as uuidv4 } from 'uuid';

export class CameraSettings {
	// Identification
	id: string = `${uuidv4()}-${Date.now()}`;
	name: string = 'untitled settings';

	// Camera settings
	camId: number = 0;
	width: number = 1920;
	height: number = 1080;
	hFlip: boolean = true;
	vFlip: boolean = true;
	brightness: number = 0;
	contrast: number = 1;
	saturation: number = 1;
	sharpness: number = 1;
	exposure: Exposure = Exposure.normal;
	whiteBalance: WhiteBalance = WhiteBalance.auto;
	awbGains: AWBGains = new AWBGains();
	denoise: Denoise = Denoise.off;
	shutterSpeed: number = 0;
	metering: Metering = Metering.centre;
	gain: number = 0;
	ev: number = -0.3;
	roi?: ROI;
	hdr: boolean = false;
	tuningFile?: string;
	sensorMode?: SensorMode;
	fps: number = 30;
	focusMode: FocusMode = FocusMode.continuous;
	afRange: AFRange = AFRange.full;
	afSpeed: AFSpeed = AFSpeed.fast;
	mfLensPosition: number = 0;
	afWindow?: AFWindow;
	flickerPeriod: number = 0;
	textOverlayEnable: boolean = false;
	textOverlay: string = '%Y-%m-%d %H:%M:%S - stream-cam (MediaMTX)';
	codec: Codec = Codec.auto;
	idrPeriod: number = 60;
	bitrate: number = 10000000;
	h264Profile: string = 'main';
	h264Level: string = '4.1';

	constructor(init?: Partial<CameraSettings>) {
		Object.assign(this, init);
	}
}

export function conformsCameraSettings(obj: any): obj is CameraSettings {
	return (
		typeof obj.id === 'string' &&
		typeof obj.name === 'string' &&
		typeof obj.camId === 'number' &&
		typeof obj.width === 'number' &&
		typeof obj.height === 'number' &&
		typeof obj.hFlip === 'boolean' &&
		typeof obj.vFlip === 'boolean' &&
		typeof obj.brightness === 'number' &&
		typeof obj.contrast === 'number' &&
		typeof obj.saturation === 'number' &&
		typeof obj.sharpness === 'number' &&
		Object.values(Exposure).includes(obj.exposure) &&
		Object.values(WhiteBalance).includes(obj.whiteBalance) &&
		conformsAWBGains(obj.awbGains) &&
		Object.values(Denoise).includes(obj.denoise) &&
		typeof obj.shutterSpeed === 'number' &&
		Object.values(Metering).includes(obj.metering) &&
		typeof obj.gain === 'number' &&
		typeof obj.ev === 'number' &&
		(obj.roi === undefined || conformsROI(obj.roi)) &&
		typeof obj.hdr === 'boolean' &&
		(obj.tuningFile === undefined || typeof obj.tuningFile === 'string') &&
		(obj.sensorMode === undefined || conformsSensorMode(obj.sensorMode)) &&
		typeof obj.fps === 'number' &&
		Object.values(FocusMode).includes(obj.focusMode) &&
		Object.values(AFRange).includes(obj.afRange) &&
		Object.values(AFSpeed).includes(obj.afSpeed) &&
		typeof obj.mfLensPosition === 'number' &&
		(obj.afWindow === undefined || conformsAFWindow(obj.afWindow)) &&
		typeof obj.flickerPeriod === 'number' &&
		typeof obj.textOverlayEnable === 'boolean' &&
		typeof obj.textOverlay === 'string' &&
		Object.values(Codec).includes(obj.codec) &&
		typeof obj.idrPeriod === 'number' &&
		typeof obj.bitrate === 'number' &&
		typeof obj.h264Profile === 'string' &&
		typeof obj.h264Level === 'string'
	);
}

export enum Exposure {
	normal = 'normal',
	short = 'short',
	long = 'long',
	custom = 'custom'
}

export enum WhiteBalance {
	auto = 'auto',
	incandescent = 'incandescent',
	tungsten = 'tungsten',
	fluorescent = 'fluorescent',
	indoor = 'indoor',
	daylight = 'daylight',
	cloudy = 'cloudy',
	custom = 'custom'
}

export class AWBGains {
	red: number = 0;
	blue: number = 0;
}

export function conformsAWBGains(obj: any): obj is AWBGains {
	return typeof obj.red === 'number' && typeof obj.blue === 'number';
}

export enum Denoise {
	off = 'off',
	cdnOff = 'cdn_off',
	cdnFast = 'cdn_fast',
	cdnHq = 'cdn_hq'
}

export enum Metering {
	centre = 'centre',
	spot = 'spot',
	matrix = 'matrix',
	custom = 'custom'
}

export class ROI {
	x: number = 0;
	y: number = 0;
	width: number = 0;
	height: number = 0;
}

export function conformsROI(obj: any): obj is ROI {
	return (
		typeof obj.x === 'number' &&
		typeof obj.y === 'number' &&
		typeof obj.width === 'number' &&
		typeof obj.height === 'number'
	);
}

export class SensorMode {
	width: number = 0;
	height: number = 0;
	bitDepth: number = 0;
	packing: number = 0;
}

export function conformsSensorMode(obj: any): obj is SensorMode {
	return (
		typeof obj.width === 'number' &&
		typeof obj.height === 'number' &&
		typeof obj.bitDepth === 'number' &&
		typeof obj.packing === 'number'
	);
}

export enum FocusMode {
	auto = 'auto',
	manual = 'manual',
	continuous = 'continuous'
}

export enum AFRange {
	normal = 'normal',
	macro = 'macro',
	full = 'full'
}

export enum AFSpeed {
	normal = 'normal',
	fast = 'fast'
}

export class AFWindow {
	x: number = 0;
	y: number = 0;
	width: number = 0;
	height: number = 0;
}

export function conformsAFWindow(obj: any): obj is AFWindow {
	return (
		typeof obj.x === 'number' &&
		typeof obj.y === 'number' &&
		typeof obj.width === 'number' &&
		typeof obj.height === 'number'
	);
}

export enum Codec {
	auto = 'auto',
	hardwareH264 = 'hardwareH264',
	softwareH264 = 'softwareH264'
}
