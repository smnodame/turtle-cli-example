import { NativeModules, Platform } from 'react-native'

export const getLanguage = () => {
    if (Platform.OS === 'ios') {
        return NativeModules.SettingsManager.settings.AppleLocale || NativeModules.SettingsManager.settings.AppleLanguages[0]
    }

    return NativeModules.I18nManager.localeIdentifier
}
