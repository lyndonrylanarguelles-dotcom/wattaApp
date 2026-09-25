import React, {
    useEffect,
    useState,
} from 'react';

import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
    Platform,
    Modal,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const TASKS_STORAGE_KEY = 'tasks';
const THEME_STORAGE_KEY = 'theme';

const CATEGORIES = [
    {
        name: 'School',
        color: '#6366F1',
        icon: 'school-outline',
    },
    {
        name: 'Work',
        color: '#0EA5E9',
        icon: 'briefcase-outline',
    },
    {
        name: 'Personal',
        color: '#8B5CF6',
        icon: 'person-outline',
    },
    {
        name: 'Health',
        color: '#10B981',
        icon: 'heart-outline',
    },
    {
        name: 'Family',
        color: '#F59E0B',
        icon: 'people-outline',
    },
    {
        name: 'Finance',
        color: '#EF4444',
        icon: 'wallet-outline',
    },
    {
        name: 'Other',
        color: '#64748B',
        icon: 'ellipsis-horizontal-outline',
    },
];

const LIGHT = {
    background: '#DDE3EA',
    card: '#E8EDF2',
    input: '#DCE2E8',
    border: '#C4CCD5',
    text: '#1F2937',
    secondary: '#5E6A78',
    muted: '#7D8996',
    primary: '#5865D8',
    primaryLight: '#D9DDFB',
};

const DARK = {
    background: '#0B1120',
    card: '#182235',
    input: '#202D43',
    border: '#344257',
    text: '#F1F5F9',
    secondary: '#B8C3D1',
    muted: '#8190A4',
    primary: '#818CF8',
    primaryLight: '#312E81',
};

const dateToString = (date) => {
    const year = date.getFullYear();

    const month = String(
        date.getMonth() + 1
    ).padStart(2, '0');

    const day = String(
        date.getDate()
    ).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

const formatDate = (date) => {
    return date.toLocaleDateString(
        'en-US',
        {
            weekday: 'short',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        }
    );
};

const dateStringToDate = (
    dateString
) => {
    const parts = dateString.split('-');

    return new Date(
        Number(parts[0]),
        Number(parts[1]) - 1,
        Number(parts[2])
    );
};

const AddTaskScreen = () => {
    const router = useRouter();

    const [taskName, setTaskName] =
        useState('');

    const [taskDescription, setTaskDescription] =
        useState('');

    const [selectedCategory, setSelectedCategory] =
        useState(CATEGORIES[0]);

    const [selectedDate, setSelectedDate] =
        useState(new Date());

    const [showCalendar, setShowCalendar] =
        useState(false);

    const [darkMode, setDarkMode] =
        useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const theme = darkMode ? DARK : LIGHT;

    // -----------------------------
    // LOAD THEME
    // -----------------------------

    useEffect(() => {
        loadTheme();
    }, []);

    const loadTheme = async () => {
        try {
            const savedTheme =
                await AsyncStorage.getItem(
                    THEME_STORAGE_KEY
                );

            setDarkMode(
                savedTheme === 'dark'
            );
        } catch (error) {
            console.error(
                'Theme loading error:',
                error
            );
        }
    };

    const toggleTheme = async () => {
        const newMode = !darkMode;

        setDarkMode(newMode);

        try {
            await AsyncStorage.setItem(
                THEME_STORAGE_KEY,
                newMode
                    ? 'dark'
                    : 'light'
            );
        } catch (error) {
            console.error(
                'Theme save error:',
                error
            );
        }
    };

    // -----------------------------
    // NOTIFICATIONS
    // -----------------------------

    const getNotifications = () => {
    return null;
};

    const requestNotificationPermission =
        async () => {
            const Notifications =
                getNotifications();

            if (!Notifications) {
                return false;
            }

            try {
                if (
                    Platform.OS === 'android'
                ) {
                    await Notifications.setNotificationChannelAsync(
                        'task-reminders',
                        {
                            name: 'Task Reminders',
                            importance:
                                Notifications.AndroidImportance.HIGH,
                            vibrationPattern: [
                                0,
                                250,
                                250,
                                250,
                            ],
                            sound: 'default',
                        }
                    );
                }

                const current =
                    await Notifications.getPermissionsAsync();

                if (
                    current.status ===
                    'granted'
                ) {
                    return true;
                }

                const requested =
                    await Notifications.requestPermissionsAsync();

                return (
                    requested.status ===
                    'granted'
                );
            } catch (error) {
                console.error(
                    'Notification permission error:',
                    error
                );

                return false;
            }
        };

    const scheduleNotification = async (
        task
    ) => {
        if (Platform.OS === 'web') {
            return null;
        }

        const Notifications = getNotifications();

if (!Notifications) {
    return null;
}

        const allowed =
            await requestNotificationPermission();

        if (!allowed) {
            return null;
        }

        try {
            const reminderDate =
                new Date(
                    selectedDate
                );

            reminderDate.setHours(9);
            reminderDate.setMinutes(0);
            reminderDate.setSeconds(0);
            reminderDate.setMilliseconds(
                0
            );

            if (
                reminderDate.getTime() <=
                Date.now()
            ) {
                return null;
            }

            return await Notifications.scheduleNotificationAsync(
                {
                    content: {
                        title: 'Task Reminder',

                        body: `${task.name} is due today.`,

                        sound: 'default',

                        data: {
                            taskId:
                                task.id,
                        },
                    },

                    trigger: {
                        type:
                            Notifications
                                .SchedulableTriggerInputTypes
                                .DATE,
                        date: reminderDate,
                    },
                }
            );
        } catch (error) {
            console.error(
                'Notification scheduling error:',
                error
            );

            return null;
        }
    };

    // -----------------------------
    // ADD TASK
    // -----------------------------

    const handleAddTask = async () => {
        if (!taskName.trim()) {
            Alert.alert(
                'Missing Task Name',
                'Please enter a task name.'
            );

            return;
        }

        try {
            const storedTasks =
                await AsyncStorage.getItem(
                    TASKS_STORAGE_KEY
                );

            const existingTasks =
                storedTasks
                    ? JSON.parse(
                          storedTasks
                      )
                    : [];

            const newTask = {
                id: Date.now().toString(),

                name: taskName.trim(),

                description:
                    taskDescription.trim(),

                category:
                    selectedCategory.name,

                categoryColor:
                    selectedCategory.color,

                date: dateToString(
                    selectedDate
                ),

                notificationId: null,
            };

            const notificationId =
                await scheduleNotification(
                    newTask
                );

            newTask.notificationId =
                notificationId;

            const updatedTasks = [
                ...existingTasks,
                newTask,
            ];

            await AsyncStorage.setItem(
                TASKS_STORAGE_KEY,
                JSON.stringify(
                    updatedTasks
                )
            );

            Alert.alert(
                'Task Added',
                `Task scheduled for ${formatDate(
                    selectedDate
                )}.`
            );

            router.replace('/');
        } catch (error) {
            console.error(
                'Error adding task:',
                error
            );

            Alert.alert(
                'Error',
                'Could not save your task.'
            );
        }
    };

    // -----------------------------
    // SELECT DATE
    // -----------------------------

    const handleDatePress = (
        day
    ) => {
        const newDate =
            dateStringToDate(
                day.dateString
            );

        setSelectedDate(
            newDate
        );

        setShowCalendar(false);
    };

    return (
        <ScrollView
            style={[
                styles.screen,
                {
                    backgroundColor:
                        theme.background,
                },
            ]}
            contentContainerStyle={
                styles.content
            }
            showsVerticalScrollIndicator={
                false
            }
        >
            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() =>
                        router.replace('/')
                    }
                    style={[
                        styles.iconButton,
                        {
                            backgroundColor:
                                theme.card,
                        },
                    ]}
                >
                    <Ionicons
                        name="arrow-back"
                        size={21}
                        color={
                            theme.text
                        }
                    />
                </TouchableOpacity>

                <View
                    style={
                        styles.headerText
                    }
                >
                    <Text
                        style={[
                            styles.headerTitle,
                            {
                                color:
                                    theme.text,
                            },
                        ]}
                    >
                        New Task
                    </Text>

                    <Text
                        style={[
                            styles.headerSubtitle,
                            {
                                color:
                                    theme.secondary,
                            },
                        ]}
                    >
                        Plan your day
                    </Text>
                </View>

                <TouchableOpacity
                    onPress={toggleTheme}
                    style={[
                        styles.iconButton,
                        {
                            backgroundColor:
                                theme.card,
                        },
                    ]}
                >
                    <Ionicons
                        name={
                            darkMode
                                ? 'sunny-outline'
                                : 'moon-outline'
                        }
                        size={21}
                        color={
                            theme.text
                        }
                    />
                </TouchableOpacity>
            </View>

            {/* FORM */}
            <View
                style={[
                    styles.card,
                    {
                        backgroundColor:
                            theme.card,
                    },
                ]}
            >
                <Text
                    style={[
                        styles.label,
                        {
                            color:
                                theme.muted,
                        },
                    ]}
                >
                    TASK NAME
                </Text>

                <TextInput
                    style={[
                        styles.input,
                        {
                            backgroundColor:
                                theme.input,
                            borderColor:
                                theme.border,
                            color:
                                theme.text,
                        },
                    ]}
                    placeholder="What needs to be done?"
                    placeholderTextColor={
                        theme.muted
                    }
                    value={
                        taskName
                    }
                    onChangeText={
                        setTaskName
                    }
                />

                <Text
                    style={[
                        styles.label,
                        {
                            color:
                                theme.muted,
                        },
                    ]}
                >
                    DESCRIPTION
                </Text>

                <TextInput
                    style={[
                        styles.input,
                        styles.descriptionInput,
                        {
                            backgroundColor:
                                theme.input,
                            borderColor:
                                theme.border,
                            color:
                                theme.text,
                        },
                    ]}
                    placeholder="Add some details..."
                    placeholderTextColor={
                        theme.muted
                    }
                    value={
                        taskDescription
                    }
                    onChangeText={
                        setTaskDescription
                    }
                    multiline
                />

                {/* DATE */}
                <Text
                    style={[
                        styles.label,
                        {
                            color:
                                theme.muted,
                        },
                    ]}
                >
                    DUE DATE
                </Text>

                <TouchableOpacity
                    style={[
                        styles.dateButton,
                        {
                            backgroundColor:
                                theme.input,
                            borderColor:
                                theme.border,
                        },
                    ]}
                    onPress={() =>
                        setShowCalendar(
                            true
                        )
                    }
                >
                    <View
                        style={[
                            styles.dateIcon,
                            {
                                backgroundColor:
                                    theme.primaryLight,
                            },
                        ]}
                    >
                        <Ionicons
                            name="calendar"
                            size={21}
                            color={
                                theme.primary
                            }
                        />
                    </View>

                    <View
                        style={
                            styles.dateTextContainer
                        }
                    >
                        <Text
                            style={[
                                styles.dateText,
                                {
                                    color:
                                        theme.text,
                                },
                            ]}
                        >
                            {formatDate(
                                selectedDate
                            )}
                        </Text>

                        <Text
                            style={[
                                styles.dateHint,
                                {
                                    color:
                                        theme.secondary,
                                },
                            ]}
                        >
                            Tap to select a
                            date
                        </Text>
                    </View>

                    <Ionicons
                        name="chevron-forward"
                        size={20}
                        color={
                            theme.muted
                        }
                    />
                </TouchableOpacity>

                {/* CATEGORIES */}
                <Text
                    style={[
                        styles.label,
                        {
                            color:
                                theme.muted,
                        },
                    ]}
                >
                    CATEGORY
                </Text>

                <View
                    style={
                        styles.categoryGrid
                    }
                >
                    {CATEGORIES.map(
                        (category) => {
                            const selected =
                                selectedCategory.name ===
                                category.name;

                            return (
                                <TouchableOpacity
                                    key={
                                        category.name
                                    }
                                    onPress={() =>
                                        setSelectedCategory(
                                            category
                                        )
                                    }
                                    style={[
                                        styles.categoryItem,
                                        {
                                            backgroundColor:
                                                selected
                                                    ? `${category.color}18`
                                                    : theme.input,
                                            borderColor:
                                                selected
                                                    ? category.color
                                                    : theme.border,
                                        },
                                    ]}
                                >
                                    <View
                                        style={[
                                            styles.categoryIcon,
                                            {
                                                backgroundColor:
                                                    `${category.color}18`,
                                            },
                                        ]}
                                    >
                                        <Ionicons
                                            name={
                                                category.icon
                                            }
                                            size={
                                                19
                                            }
                                            color={
                                                category.color
                                            }
                                        />
                                    </View>

                                    <Text
                                        style={[
                                            styles.categoryText,
                                            {
                                                color:
                                                    selected
                                                        ? category.color
                                                        : theme.secondary,
                                            },
                                        ]}
                                    >
                                        {
                                            category.name
                                        }
                                    </Text>

                                    {selected && (
                                        <Ionicons
                                            name="checkmark-circle"
                                            size={
                                                16
                                            }
                                            color={
                                                category.color
                                            }
                                        />
                                    )}
                                </TouchableOpacity>
                            );
                        }
                    )}
                </View>
            </View>

            {/* CREATE BUTTON */}
            <TouchableOpacity
                style={[
                    styles.createButton,
                    {
                        backgroundColor:
                            theme.primary,
                    },
                ]}
                onPress={
                    handleAddTask
                }
                activeOpacity={
                    0.85
                }
            >
                <Ionicons
                    name="checkmark"
                    size={22}
                    color="white"
                />

                <Text
                    style={
                        styles.createButtonText
                    }
                >
                    Create Task
                </Text>
            </TouchableOpacity>

            {/* DATE CALENDAR MODAL */}
            <Modal
                visible={
                    showCalendar
                }
                transparent
                animationType="slide"
                onRequestClose={() =>
                    setShowCalendar(
                        false
                    )
                }
            >
                <View
                    style={
                        styles.modalOverlay
                    }
                >
                    <View
                        style={[
                            styles.calendarModal,
                            {
                                backgroundColor:
                                    theme.card,
                            },
                        ]}
                    >
                        <View
                            style={
                                styles.modalHeader
                            }
                        >
                            <View>
                                <Text
                                    style={[
                                        styles.modalTitle,
                                        {
                                            color:
                                                theme.text,
                                        },
                                    ]}
                                >
                                    Select Due Date
                                </Text>

                                <Text
                                    style={[
                                        styles.modalSubtitle,
                                        {
                                            color:
                                                theme.secondary,
                                        },
                                    ]}
                                >
                                    Choose when the
                                    task is due
                                </Text>
                            </View>

                            <TouchableOpacity
                                style={[
                                    styles.closeButton,
                                    {
                                        backgroundColor:
                                            theme.input,
                                    },
                                ]}
                                onPress={() =>
                                    setShowCalendar(
                                        false
                                    )
                                }
                            >
                                <Ionicons
                                    name="close"
                                    size={
                                        21
                                    }
                                    color={
                                        theme.text
                                    }
                                />
                            </TouchableOpacity>
                        </View>

                        <View
                            style={[
                                styles.selectedDateBox,
                                {
                                    backgroundColor:
                                        theme.primaryLight,
                                },
                            ]}
                        >
                            <Ionicons
                                name="calendar-outline"
                                size={
                                    20
                                }
                                color={
                                    theme.primary
                                }
                            />

                            <View
                                style={
                                    styles.selectedDateInfo
                                }
                            >
                                <Text
                                    style={[
                                        styles.selectedDateLabel,
                                        {
                                            color:
                                                theme.muted,
                                        },
                                    ]}
                                >
                                    SELECTED DATE
                                </Text>

                                <Text
                                    style={[
                                        styles.selectedDateText,
                                        {
                                            color:
                                                theme.text,
                                        },
                                    ]}
                                >
                                    {formatDate(
                                        selectedDate
                                    )}
                                </Text>
                            </View>
                        </View>

                        <Calendar
                            current={dateToString(
                                selectedDate
                            )}
                            onDayPress={
                                handleDatePress
                            }
                            enableSwipeMonths
                            firstDay={1}
                            theme={{
                                backgroundColor:
                                    theme.card,
                                calendarBackground:
                                    theme.card,
                                textSectionTitleColor:
                                    theme.muted,
                                selectedDayBackgroundColor:
                                    theme.primary,
                                selectedDayTextColor:
                                    '#FFFFFF',
                                todayTextColor:
                                    theme.primary,
                                dayTextColor:
                                    theme.text,
                                textDisabledColor:
                                    theme.muted,
                                monthTextColor:
                                    theme.text,
                                arrowColor:
                                    theme.primary,
                                textMonthFontWeight:
                                    '800',
                                textDayHeaderFontWeight:
                                    '700',
                            }}
                            markedDates={{
                                [dateToString(
                                    selectedDate
                                )]: {
                                    selected:
                                        true,
                                    selectedColor:
                                        theme.primary,
                                    selectedTextColor:
                                        '#FFFFFF',
                                },
                            }}
                        />

                        <TouchableOpacity
                            style={[
                                styles.useDateButton,
                                {
                                    backgroundColor:
                                        theme.primary,
                                },
                            ]}
                            onPress={() =>
                                setShowCalendar(
                                    false
                                )
                            }
                        >
                            <Ionicons
                                name="checkmark"
                                size={
                                    20
                                }
                                color="white"
                            />

                            <Text
                                style={
                                    styles.useDateText
                                }
                            >
                                Use This Date
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },

    content: {
        padding: 20,
        paddingBottom: 40,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },

    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
    },

    headerText: {
        flex: 1,
        marginLeft: 13,
    },

    headerTitle: {
        fontSize: 27,
        fontWeight: '800',
    },

    headerSubtitle: {
        fontSize: 13,
        marginTop: 3,
    },

    card: {
        borderRadius: 24,
        padding: 20,
        elevation: 3,
    },

    label: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1.1,
        marginTop: 5,
        marginBottom: 9,
    },

    input: {
        height: 52,
        borderWidth: 1,
        borderRadius: 14,
        paddingHorizontal: 15,
        fontSize: 15,
        marginBottom: 18,
    },

    descriptionInput: {
        height: 100,
        paddingTop: 14,
        textAlignVertical: 'top',
    },

    dateButton: {
        height: 74,
        borderWidth: 1,
        borderRadius: 17,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        marginBottom: 20,
    },

    dateIcon: {
        width: 44,
        height: 44,
        borderRadius: 13,
        justifyContent: 'center',
        alignItems: 'center',
    },

    dateTextContainer: {
        flex: 1,
        marginLeft: 12,
    },

    dateText: {
        fontSize: 15,
        fontWeight: '800',
    },

    dateHint: {
        fontSize: 12,
        marginTop: 3,
    },

    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },

    categoryItem: {
        width: '31%',
        minHeight: 88,
        borderWidth: 1,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 7,
    },

    categoryIcon: {
        width: 35,
        height: 35,
        borderRadius: 11,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
    },

    categoryText: {
        fontSize: 10.5,
        fontWeight: '700',
        marginBottom: 3,
    },

    createButton: {
        height: 56,
        borderRadius: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 18,
        elevation: 4,
    },

    createButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '800',
    },

    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor:
            'rgba(0,0,0,0.55)',
    },

    calendarModal: {
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        padding: 20,
        paddingBottom: 28,
    },

    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },

    modalTitle: {
        fontSize: 22,
        fontWeight: '800',
    },

    modalSubtitle: {
        fontSize: 12,
        marginTop: 3,
    },

    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 13,
        justifyContent: 'center',
        alignItems: 'center',
    },

    selectedDateBox: {
        borderRadius: 15,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },

    selectedDateInfo: {
        marginLeft: 10,
    },

    selectedDateLabel: {
        fontSize: 9,
        fontWeight: '800',
        letterSpacing: 1,
    },

    selectedDateText: {
        fontSize: 14,
        fontWeight: '800',
        marginTop: 2,
    },

    useDateButton: {
        height: 52,
        borderRadius: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        marginTop: 10,
    },

    useDateText: {
        color: 'white',
        fontSize: 15,
        fontWeight: '800',
    },
});

export default AddTaskScreen;
