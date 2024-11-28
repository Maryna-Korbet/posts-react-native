import React, { FC, RefObject, useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Button,
    AccessibilityInfo,
    findNodeHandle,
} from 'react-native';
import {
    CameraView,
    CameraType,
    useCameraPermissions,
} from 'expo-camera';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as MediaLibrary from 'expo-media-library';
import * as Location from 'expo-location';

import IconButton from '../../../components/buttons/IconButton';
import CameraIcon from '../../../icons/CameraIcon';
import CameraSwitchIcon from '../../../icons/CameraSwitch';

import { colors } from '../../../styles/GlobalStyles';
import { styles } from './CameraScreen.styles';



type CreatePostStackParamList = {
    Camera: undefined,
    CreatePost: {
        picture?: string,
        location?: Location.LocationObject | undefined,
    },
};

type CameraScreenProps = NativeStackScreenProps<CreatePostStackParamList, 'Camera'>;

const CameraScreen: FC<CameraScreenProps> = ({ navigation, route }) => {
    const cameraRef: RefObject<any> = useRef(null);
    const messageRef = useRef<Text | null>(null);

    useEffect(() => {
        if (messageRef.current) {
            const node = findNodeHandle(messageRef.current);
            if (node) {
                AccessibilityInfo.setAccessibilityFocus(node);
            }
        }
    }, []);

    // Camera permissions
    const [cameraPermission, requestCameraPermission] = useCameraPermissions();
    const [libraryPermission, requestLibraryPermission] = MediaLibrary.usePermissions();
    // Camera picture
    const [facing, setFacing] = useState<CameraType>('back');
    const [picture, setPicture] = useState<string | null>(null);
    // Camera location
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Handle Location Permissions
    useEffect(() => {
        async function getCurrentLocation() {

            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        }

        getCurrentLocation();
    }, []);

    // Handle Camera Permissions
    if (!cameraPermission) return <View />;
    if (!cameraPermission.granted) {
        return (
            <View style={styles.permissionContainer}>
                <Text
                    ref={messageRef}
                    style={styles.permissioMmessage}
                    accessibilityRole="text"
                >
                    We need your permission to show the camera
                </Text>
                <Button
                    onPress={requestCameraPermission}
                    title="Grant Permission"
                    color={colors.orange}
                    accessibilityLabel="Learn more about this purple button."
                />
            </View>
        );
    }

    // Handle Media Library Permissions
    if (!libraryPermission) return <View />;
    if (!libraryPermission.granted) {
        return (
            <View style={styles.permissionContainer}>
                <Text
                    ref={messageRef}
                    style={styles.permissioMmessage}
                    accessibilityRole="text"
                >
                    We need your permission to save the photo
                </Text>
                <Button
                    onPress={requestLibraryPermission}
                    title="Grant Permission"
                    color={colors.orange}
                    accessibilityLabel="Learn more about this purple button."
                />
            </View>
        );
    }

    let text = 'Waiting...';
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = JSON.stringify(location);
    };

    // Toggle Camera Facing
    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    // Take and Save Photo
    const takePicture = async () => {
        if (!cameraRef.current) return;

        try {
            const picture = await cameraRef.current.takePictureAsync();
            const currentLocation = location || await Location.getCurrentPositionAsync();

            if (picture?.uri) {
                await MediaLibrary.saveToLibraryAsync(picture.uri);
                setPicture(picture.uri);

                navigation.navigate('CreatePost', {
                    picture: picture.uri,
                    location: currentLocation,
                });
                
                alert('Photo saved to library!');

                //!: Delete later console.log
                console.log("photo---->", picture)
                console.log("location--->", location);
            } else {
                alert('Something went wrong!');
            }
        } catch (error) {
            //!: Delete later console.log
            console.error('Error taking or saving photo:', error);
            alert('Error taking or saving photo!');
        }
    };

    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                facing={facing}
                ref={cameraRef}
                autofocus='on'
                zoom={1}
            >

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button}>
                        <View style={styles.buttonCircle} />
                        <View style={styles.iconPosition}>
                            <IconButton
                                icon={<CameraIcon />}
                                onPress={takePicture}
                            />
                        </View>
                    </TouchableOpacity>
                </View>

                <View>
                    <TouchableOpacity
                        style={styles.toggleButton}
                        onPress={toggleCameraFacing}
                    >
                        <CameraSwitchIcon />
                    </TouchableOpacity>
                </View>
            </CameraView>
            
            <TouchableOpacity
                style={styles.editButtonContainer}
                onPress={() => setPicture(null)}
            >
                <View style={styles.editButton}>
                    <Text
                        style={[
                            styles.editText,
                            picture ? styles.editTextColorActive : styles.editTextColor
                        ]}
                    >
                        Edit Photo
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};


export default CameraScreen;