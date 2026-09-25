import React, { useCallback, useMemo, useState } from 'react';
import {
    Alert,
    FlatList,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';

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

const CATEGORY_COLORS = Object.fromEntries(
    CATEGORIES.map((category) => [
        category.name,
        category.color,
    ])
);

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
    danger: '#D64545',
    dangerLight: '#F6DCDC',
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
    danger: '#F87171',
    dangerLight: '#451A1A',
};

// ============================================================
// DATE HELPERS
// ============================================================

const getTodayString = () => {
    const date = new Date();

    return (
        `${date.getFullYear()}-` +
        `${String(date.getMonth() + 1).padStart(2, '0')}-` +
        `${String(date.getDate()).padStart(2, '0')}`
    );
};

const dateStringToDate = (dateString) => {
    if (
        !dateString ||
        typeof dateString !== 'string'
    ) {
        return new Date();
    }

    const parts = dateString.split('-');

    if (parts.length !== 3) {
        return new Date();
    }

    return new Date(
        Number(parts[0]),
        Number(parts[1]) - 1,
        Number(parts[2])
    );
};

const dateToString = (date) => {
    return (
        `${date.getFullYear()}-` +
        `${String(date.getMonth() + 1).padStart(2, '0')}-` +
        `${String(date.getDate()).padStart(2, '0')}`
    );
};

const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
};

const formatLongDate = (dateString) => {
    return dateStringToDate(
        dateString
    ).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    });
};

// ============================================================
// CATEGORY HELPERS
// ============================================================

const getCategory = (value) => {
    const categoryName =
        typeof value === 'object'
            ? value?.name
            : value;

    const normalized = String(
        categoryName || 'Other'
    )
        .trim()
        .toLowerCase();

    return (
        CATEGORIES.find(
            (category) =>
                category.name
                    .toLowerCase() ===
                normalized
        ) ||
        CATEGORIES[
            CATEGORIES.length - 1
        ]
    );
};

const getTaskText = (
    task,
    keys
) => {
    for (const key of keys) {
        const value = task?.[key];

        if (
            value !== undefined &&
            value !== null &&
            String(value).trim() !== ''
        ) {
            return String(value);
        }
    }

    return '';
};

const getTaskCategoryName = (
    task
) => {
    const category =
        typeof task?.category ===
        'object'
            ? task.category?.name
            : task?.category;

    return String(
        category || 'Other'
    ).trim();
};

// ============================================================
// HEADER
//
// IMPORTANT:
// This component is outside TaskListScreen.
// This prevents the TextInput from being remounted whenever
// searchQuery changes.
// ============================================================

const TaskListHeader = React.memo(
    ({
        theme,
        darkMode,
        toggleTheme,
        router,
        searchQuery,
        setSearchQuery,
        categoryFilter,
        setCategoryFilter,
        showCalendar,
        setShowCalendar,
        markedDates,
        selectedDate,
        setSelectedDate,
        filteredTasks,
    }) => {
        return (
            <>
                {/* HEADER */}
                <View
                    style={styles.header}
                >
                    <View
                        style={
                            styles.headerTextWrap
                        }
                    >
                        <Text
                            style={[
                                styles.title,
                                {
                                    color:
                                        theme.text,
                                },
                            ]}
                        >
                            My Tasks
                        </Text>

                        <Text
                            style={[
                                styles.subtitle,
                                {
                                    color:
                                        theme.secondary,
                                },
                            ]}
                        >
                            Stay organized, one
                            day at a time.
                        </Text>
                    </View>

                    <View
                        style={
                            styles.headerActions
                        }
                    >
                        {/* THEME */}
                        <TouchableOpacity
                            style={[
                                styles.iconButton,
                                {
                                    backgroundColor:
                                        theme.card,
                                },
                            ]}
                            onPress={
                                toggleTheme
                            }
                        >
                            <Ionicons
                                name={
                                    darkMode
                                        ? 'sunny-outline'
                                        : 'moon-outline'
                                }
                                size={21}
                                color={
                                    theme.primary
                                }
                            />
                        </TouchableOpacity>

                        {/* PROFILE */}
                        <TouchableOpacity
                            style={[
                                styles.iconButton,
                                {
                                    backgroundColor:
                                        theme.card,
                                },
                            ]}
                            onPress={() =>
                                router.push(
                                    '/profile'
                                )
                            }
                        >
                            <Ionicons
                                name="person-outline"
                                size={21}
                                color={
                                    theme.primary
                                }
                            />
                        </TouchableOpacity>

                        {/* ADD */}
                        <TouchableOpacity
                            style={[
                                styles.addHeaderButton,
                                {
                                    backgroundColor:
                                        theme.primary,
                                },
                            ]}
                            onPress={() =>
                                router.push(
                                    '/Taskadd'
                                )
                            }
                        >
                            <Ionicons
                                name="add"
                                size={25}
                                color="#FFFFFF"
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* SEARCH */}
                <View
                    style={[
                        styles.searchContainer,
                        {
                            backgroundColor:
                                theme.input,
                            borderColor:
                                theme.border,
                        },
                    ]}
                >
                    <Ionicons
                        name="search-outline"
                        size={20}
                        color={theme.muted}
                    />

                    <TextInput
                        style={[
                            styles.searchInput,
                            {
                                color:
                                    theme.text,
                            },
                        ]}
                        value={searchQuery}
                        onChangeText={
                            setSearchQuery
                        }
                        placeholder="Search tasks..."
                        placeholderTextColor={
                            theme.muted
                        }
                        returnKeyType="search"
                        autoCorrect={false}
                        autoCapitalize="none"
                        blurOnSubmit={false}
                    />

                    {searchQuery.length >
                        0 && (
                        <TouchableOpacity
                            onPress={() =>
                                setSearchQuery(
                                    ''
                                )
                            }
                        >
                            <Ionicons
                                name="close-circle"
                                size={20}
                                color={
                                    theme.muted
                                }
                            />
                        </TouchableOpacity>
                    )}
                </View>

                {/* CATEGORY FILTERS */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={
                        false
                    }
                    keyboardShouldPersistTaps="always"
                    contentContainerStyle={
                        styles.filterContainer
                    }
                >
                    {[
                        'All',
                        ...CATEGORIES.map(
                            (category) =>
                                category.name
                        ),
                    ].map((item) => {
                        const selected =
                            categoryFilter ===
                            item;

                        const category =
                            item === 'All'
                                ? null
                                : getCategory(
                                      item
                                  );

                        return (
                            <TouchableOpacity
                                key={item}
                                activeOpacity={0.7}
                                style={[
                                    styles.filterChip,
                                    {
                                        backgroundColor:
                                            selected
                                                ? theme.primary
                                                : theme.card,

                                        borderColor:
                                            selected
                                                ? theme.primary
                                                : theme.border,
                                    },
                                ]}
                                onPress={() =>
                                    setCategoryFilter(
                                        item
                                    )
                                }
                            >
                                {category && (
                                    <View
                                        style={[
                                            styles.filterDot,
                                            {
                                                backgroundColor:
                                                    selected
                                                        ? '#FFFFFF'
                                                        : category.color,
                                            },
                                        ]}
                                    />
                                )}

                                <Text
                                    style={[
                                        styles.filterText,
                                        {
                                            color:
                                                selected
                                                    ? '#FFFFFF'
                                                    : theme.secondary,
                                        },
                                    ]}
                                >
                                    {item}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>

                {/* CALENDAR TOGGLE */}
                <TouchableOpacity
                    style={[
                        styles.calendarToggle,
                        {
                            backgroundColor:
                                theme.card,
                            borderColor:
                                theme.border,
                        },
                    ]}
                    onPress={() =>
                        setShowCalendar(
                            (value) =>
                                !value
                        )
                    }
                >
                    <Ionicons
                        name={
                            showCalendar
                                ? 'calendar-outline'
                                : 'calendar'
                        }
                        size={19}
                        color={theme.primary}
                    />

                    <Text
                        style={[
                            styles.calendarToggleText,
                            {
                                color:
                                    theme.text,
                            },
                        ]}
                    >
                        {showCalendar
                            ? 'Hide Calendar'
                            : 'Show Calendar'}
                    </Text>

                    <Ionicons
                        name={
                            showCalendar
                                ? 'chevron-up'
                                : 'chevron-down'
                        }
                        size={18}
                        color={theme.muted}
                    />
                </TouchableOpacity>

                {/* CALENDAR */}
                {showCalendar && (
                    <View
                        style={[
                            styles.calendarCard,
                            {
                                backgroundColor:
                                    theme.card,
                            },
                        ]}
                    >
                        <Calendar
                            markingType="multi-dot"
                            markedDates={
                                markedDates
                            }
                            onDayPress={(
                                day
                            ) =>
                                setSelectedDate(
                                    day.dateString
                                )
                            }
                            enableSwipeMonths
                            firstDay={1}
                            hideExtraDays
                            style={
                                styles.calendar
                            }
                            theme={{
                                backgroundColor:
                                    theme.card,

                                calendarBackground:
                                    theme.card,

                                textSectionTitleColor:
                                    theme.muted,

                                textSectionTitleDisabledColor:
                                    theme.muted,

                                selectedDayBackgroundColor:
                                    theme.primaryLight,

                                selectedDayTextColor:
                                    theme.primary,

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

                                disabledArrowColor:
                                    theme.muted,

                                textDayFontSize: 14,
                                textMonthFontSize: 17,
                                textDayHeaderFontSize: 11,

                                textMonthFontWeight:
                                    '800',

                                textDayHeaderFontWeight:
                                    '700',
                            }}
                        />
                    </View>
                )}

                {/* SELECTED DAY */}
                <View
                    style={
                        styles.selectedHeader
                    }
                >
                    <View>
                        <Text
                            style={[
                                styles.selectedLabel,
                                {
                                    color:
                                        theme.muted,
                                },
                            ]}
                        >
                            SELECTED DAY
                        </Text>

                        <Text
                            style={[
                                styles.selectedDate,
                                {
                                    color:
                                        theme.text,
                                },
                            ]}
                        >
                            {formatLongDate(
                                selectedDate
                            )}
                        </Text>
                    </View>

                    <View
                        style={[
                            styles.countBubble,
                            {
                                backgroundColor:
                                    theme.primaryLight,
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.countText,
                                {
                                    color:
                                        theme.primary,
                                },
                            ]}
                        >
                            {
                                filteredTasks.length
                            }
                        </Text>
                    </View>
                </View>
            </>
        );
    }
);

// ============================================================
// MAIN SCREEN
// ============================================================

const TaskListScreen = () => {
    const router = useRouter();

    const [tasks, setTasks] =
        useState([]);

    const [
        selectedDate,
        setSelectedDate,
    ] = useState(
        getTodayString()
    );

    const [
        darkMode,
        setDarkMode,
    ] = useState(false);

    const [
        searchQuery,
        setSearchQuery,
    ] = useState('');

    const [
        categoryFilter,
        setCategoryFilter,
    ] = useState('All');

    const [
        showCalendar,
        setShowCalendar,
    ] = useState(true);

    const [
        editingTask,
        setEditingTask,
    ] = useState(null);

    const [
        editedName,
        setEditedName,
    ] = useState('');

    const [
        editedDescription,
        setEditedDescription,
    ] = useState('');

    const [
        editedCategory,
        setEditedCategory,
    ] = useState(
        CATEGORIES[0]
    );

    const [
        editedDate,
        setEditedDate,
    ] = useState(new Date());

    const [
        showEditCalendar,
        setShowEditCalendar,
    ] = useState(false);

    const theme =
        darkMode ? DARK : LIGHT;

    // ============================================================
    // LOAD DATA
    // ============================================================

    const loadData =
        useCallback(async () => {
            try {
                const [
                    storedTasks,
                    storedTheme,
                ] = await Promise.all([
                    AsyncStorage.getItem(
                        TASKS_STORAGE_KEY
                    ),
                    AsyncStorage.getItem(
                        THEME_STORAGE_KEY
                    ),
                ]);

                let parsedTasks = [];

                if (storedTasks) {
                    try {
                        const parsed =
                            JSON.parse(
                                storedTasks
                            );

                        if (
                            Array.isArray(
                                parsed
                            )
                        ) {
                            parsedTasks =
                                parsed;
                        }
                    } catch (error) {
                        console.error(
                            'Could not parse stored tasks:',
                            error
                        );
                    }
                }

                setTasks(
                    parsedTasks
                );

                setDarkMode(
                    storedTheme ===
                        'dark'
                );
            } catch (error) {
                console.error(
                    'Error loading data:',
                    error
                );
            }
        }, []);

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [loadData])
    );

    // ============================================================
    // THEME
    // ============================================================

    const toggleTheme =
        useCallback(async () => {
            const newMode =
                !darkMode;

            setDarkMode(
                newMode
            );

            try {
                await AsyncStorage.setItem(
                    THEME_STORAGE_KEY,
                    newMode
                        ? 'dark'
                        : 'light'
                );
            } catch (error) {
                console.error(
                    'Error saving theme:',
                    error
                );
            }
        }, [darkMode]);

    // ============================================================
    // TASKS FOR SELECTED DAY
    // ============================================================

    const selectedTasks =
        useMemo(() => {
            return tasks.filter(
                (task) =>
                    task?.date ===
                    selectedDate
            );
        }, [
            tasks,
            selectedDate,
        ]);

    // ============================================================
    // SEARCH + FILTER
    //
    // When nothing is searched/filtered:
    //   Show tasks for selected calendar day.
    //
    // When search OR category filter is active:
    //   Search/filter ALL saved tasks.
    // ============================================================

    const filteredTasks =
        useMemo(() => {
            const query =
                String(
                    searchQuery || ''
                )
                    .trim()
                    .toLowerCase();

            const selectedCategory =
                String(
                    categoryFilter ||
                        'All'
                )
                    .trim()
                    .toLowerCase();

            const searching =
                query.length > 0;

            const filteringCategory =
                selectedCategory !==
                'all';

            const sourceTasks =
                searching ||
                filteringCategory
                    ? tasks
                    : selectedTasks;

            return sourceTasks.filter(
                (task) => {
                    const name =
                        getTaskText(
                            task,
                            [
                                'name',
                                'title',
                                'taskName',
                            ]
                        ).toLowerCase();

                    const description =
                        getTaskText(
                            task,
                            [
                                'description',
                                'details',
                                'taskDescription',
                            ]
                        ).toLowerCase();

                    const category =
                        getTaskCategoryName(
                            task
                        ).toLowerCase();

                    const matchesSearch =
                        !searching ||
                        name.includes(
                            query
                        ) ||
                        description.includes(
                            query
                        ) ||
                        category.includes(
                            query
                        );

                    const matchesCategory =
                        !filteringCategory ||
                        category ===
                            selectedCategory;

                    return (
                        matchesSearch &&
                        matchesCategory
                    );
                }
            );
        }, [
            tasks,
            selectedTasks,
            searchQuery,
            categoryFilter,
        ]);

    // ============================================================
    // CALENDAR MARKERS
    // ============================================================

    const markedDates =
        useMemo(() => {
            const result = {};

            tasks.forEach(
                (task) => {
                    if (!task?.date) {
                        return;
                    }

                    const categoryName =
                        getTaskCategoryName(
                            task
                        );

                    const category =
                        getCategory(
                            categoryName
                        );

                    const categoryColor =
                        task.categoryColor ||
                        category.color;

                    if (
                        !result[
                            task.date
                        ]
                    ) {
                        result[
                            task.date
                        ] = {
                            marked: true,
                            dots: [],
                        };
                    }

                    const key =
                        categoryName ||
                        String(task.id);

                    const exists =
                        result[
                            task.date
                        ].dots.some(
                            (dot) =>
                                dot.key ===
                                key
                        );

                    if (!exists) {
                        result[
                            task.date
                        ].dots.push({
                            key,
                            color:
                                categoryColor,
                        });
                    }
                }
            );

            result[
                selectedDate
            ] = {
                ...(result[
                    selectedDate
                ] || {}),
                selected: true,
                selectedColor:
                    theme.primaryLight,
                selectedTextColor:
                    theme.primary,
            };

            return result;
        }, [
            tasks,
            selectedDate,
            theme.primary,
            theme.primaryLight,
        ]);

    // ============================================================
    // DELETE TASK
    // ============================================================

    const handleDeleteTask =
        useCallback(
            (taskId) => {
                Alert.alert(
                    'Delete Task',
                    'Are you sure you want to delete this task?',
                    [
                        {
                            text: 'Cancel',
                            style: 'cancel',
                        },
                        {
                            text: 'Delete',
                            style: 'destructive',
                            onPress:
                                async () => {
                                    try {
                                        const updatedTasks =
                                            tasks.filter(
                                                (
                                                    task
                                                ) =>
                                                    String(
                                                        task.id
                                                    ) !==
                                                    String(
                                                        taskId
                                                    )
                                            );

                                        await AsyncStorage.setItem(
                                            TASKS_STORAGE_KEY,
                                            JSON.stringify(
                                                updatedTasks
                                            )
                                        );

                                        setTasks(
                                            updatedTasks
                                        );
                                    } catch (error) {
                                        console.error(
                                            'DELETE ERROR:',
                                            error
                                        );

                                        Alert.alert(
                                            'Error',
                                            'Could not delete the task.'
                                        );
                                    }
                                },
                        },
                    ]
                );
            },
            [tasks]
        );

    // ============================================================
    // OPEN EDIT
    // ============================================================

    const openEditTask =
        useCallback(
            (task) => {
                setEditingTask(
                    task
                );

                setEditedName(
                    getTaskText(
                        task,
                        [
                            'name',
                            'title',
                            'taskName',
                        ]
                    )
                );

                setEditedDescription(
                    getTaskText(
                        task,
                        [
                            'description',
                            'details',
                            'taskDescription',
                        ]
                    )
                );

                setEditedCategory(
                    getCategory(
                        task?.category
                    )
                );

                setEditedDate(
                    dateStringToDate(
                        task?.date
                    )
                );
            },
            []
        );

    // ============================================================
    // SAVE EDIT
    // ============================================================

    const handleSaveEdit =
        async () => {
            if (!editingTask) {
                return;
            }

            if (
                !editedName.trim()
            ) {
                Alert.alert(
                    'Validation Error',
                    'Task name is required.'
                );
                return;
            }

            try {
                const updatedTasks =
                    tasks.map(
                        (task) => {
                            if (
                                String(
                                    task.id
                                ) !==
                                String(
                                    editingTask.id
                                )
                            ) {
                                return task;
                            }

                            return {
                                ...task,

                                name: editedName.trim(),

                                description:
                                    editedDescription.trim(),

                                category:
                                    editedCategory.name,

                                categoryColor:
                                    editedCategory.color,

                                date: dateToString(
                                    editedDate
                                ),
                            };
                        }
                    );

                await AsyncStorage.setItem(
                    TASKS_STORAGE_KEY,
                    JSON.stringify(
                        updatedTasks
                    )
                );

                setTasks(
                    updatedTasks
                );

                setEditingTask(
                    null
                );

                setShowEditCalendar(
                    false
                );

                Alert.alert(
                    'Task Updated',
                    'Your task has been updated successfully.'
                );
            } catch (error) {
                console.error(
                    'Edit error:',
                    error
                );

                Alert.alert(
                    'Error',
                    'Unable to update the task.'
                );
            }
        };

    // ============================================================
    // TASK CARD
    // ============================================================

    const renderTask =
        ({ item }) => {
            const category =
                getCategory(
                    item?.category
                );

            const categoryColor =
                item?.categoryColor ||
                category.color;

            const name =
                getTaskText(
                    item,
                    [
                        'name',
                        'title',
                        'taskName',
                    ]
                ) ||
                'Untitled Task';

            const description =
                getTaskText(
                    item,
                    [
                        'description',
                        'details',
                        'taskDescription',
                    ]
                );

            return (
                <View
                    style={[
                        styles.taskCard,
                        {
                            backgroundColor:
                                theme.card,
                        },
                    ]}
                >
                    <View
                        style={[
                            styles.colorBar,
                            {
                                backgroundColor:
                                    categoryColor,
                            },
                        ]}
                    />

                    <View
                        style={
                            styles.taskContent
                        }
                    >
                        <View
                            style={
                                styles.taskTop
                            }
                        >
                            <View
                                style={
                                    styles.taskTitleContainer
                                }
                            >
                                <Text
                                    style={[
                                        styles.taskName,
                                        {
                                            color:
                                                theme.text,
                                        },
                                    ]}
                                    numberOfLines={
                                        2
                                    }
                                >
                                    {
                                        name
                                    }
                                </Text>
                            </View>

                            <View
                                style={
                                    styles.actionButtons
                                }
                            >
                                <TouchableOpacity
                                    style={[
                                        styles.actionButton,
                                        {
                                            backgroundColor:
                                                theme.input,
                                        },
                                    ]}
                                    onPress={() =>
                                        openEditTask(
                                            item
                                        )
                                    }
                                >
                                    <Ionicons
                                        name="create-outline"
                                        size={
                                            18
                                        }
                                        color={
                                            theme.primary
                                        }
                                    />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.actionButton,
                                        {
                                            backgroundColor:
                                                theme.dangerLight,
                                        },
                                    ]}
                                    onPress={() =>
                                        handleDeleteTask(
                                            item.id
                                        )
                                    }
                                >
                                    <Ionicons
                                        name="trash-outline"
                                        size={
                                            18
                                        }
                                        color={
                                            theme.danger
                                        }
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {!!description && (
                            <Text
                                style={[
                                    styles.taskDescription,
                                    {
                                        color:
                                            theme.secondary,
                                    },
                                ]}
                            >
                                {
                                    description
                                }
                            </Text>
                        )}

                        <View
                            style={[
                                styles.categoryBadge,
                                {
                                    backgroundColor:
                                        `${categoryColor}18`,
                                },
                            ]}
                        >
                            <View
                                style={[
                                    styles.categoryDot,
                                    {
                                        backgroundColor:
                                            categoryColor,
                                    },
                                ]}
                            />

                            <Text
                                style={[
                                    styles.categoryText,
                                    {
                                        color:
                                            categoryColor,
                                    },
                                ]}
                            >
                                {
                                    getTaskCategoryName(
                                        item
                                    )
                                }
                            </Text>
                        </View>

                        {/* SHOW DATE WHEN SEARCH/FILTER IS ACTIVE */}
                        {(searchQuery ||
                            categoryFilter !==
                                'All') &&
                            item?.date && (
                                <Text
                                    style={[
                                        styles.taskDateHint,
                                        {
                                            color:
                                                theme.muted,
                                        },
                                    ]}
                                >
                                    {formatLongDate(
                                        item.date
                                    )}
                                </Text>
                            )}
                    </View>
                </View>
            );
        };

    // ============================================================
    // EMPTY STATE
    // ============================================================

    const EmptyComponent =
        () => (
            <View
                style={[
                    styles.emptyCard,
                    {
                        backgroundColor:
                            theme.card,
                    },
                ]}
            >
                <View
                    style={[
                        styles.emptyIcon,
                        {
                            backgroundColor:
                                theme.primaryLight,
                        },
                    ]}
                >
                    <Ionicons
                        name="checkmark-done-outline"
                        size={28}
                        color={
                            theme.primary
                        }
                    />
                </View>

                <Text
                    style={[
                        styles.emptyTitle,
                        {
                            color:
                                theme.text,
                        },
                    ]}
                >
                    Nothing scheduled
                </Text>

                <Text
                    style={[
                        styles.emptyText,
                        {
                            color:
                                theme.secondary,
                        },
                    ]}
                >
                    {searchQuery ||
                    categoryFilter !==
                        'All'
                        ? 'No tasks match your current filters.'
                        : 'No tasks are scheduled for this day.'}
                </Text>

                <TouchableOpacity
                    style={[
                        styles.emptyButton,
                        {
                            backgroundColor:
                                theme.primary,
                        },
                    ]}
                    onPress={() =>
                        router.push(
                            '/Taskadd'
                        )
                    }
                >
                    <Ionicons
                        name="add"
                        size={19}
                        color="#FFFFFF"
                    />

                    <Text
                        style={
                            styles.emptyButtonText
                        }
                    >
                        Add Task
                    </Text>
                </TouchableOpacity>
            </View>
        );

    // ============================================================
    // RETURN
    // ============================================================

    return (
        <View
            style={[
                styles.screen,
                {
                    backgroundColor:
                        theme.background,
                },
            ]}
        >
            <FlatList
                data={
                    filteredTasks
                }
                keyExtractor={(
                    item,
                    index
                ) =>
                    String(
                        item?.id ??
                            index
                    )
                }
                renderItem={
                    renderTask
                }
                showsVerticalScrollIndicator={
                    false
                }
                contentContainerStyle={
                    styles.listContent
                }
                keyboardShouldPersistTaps="always"
                keyboardDismissMode="none"
                ListHeaderComponent={
                    <TaskListHeader
                        theme={theme}
                        darkMode={
                            darkMode
                        }
                        toggleTheme={
                            toggleTheme
                        }
                        router={router}
                        searchQuery={
                            searchQuery
                        }
                        setSearchQuery={
                            setSearchQuery
                        }
                        categoryFilter={
                            categoryFilter
                        }
                        setCategoryFilter={
                            setCategoryFilter
                        }
                        showCalendar={
                            showCalendar
                        }
                        setShowCalendar={
                            setShowCalendar
                        }
                        markedDates={
                            markedDates
                        }
                        selectedDate={
                            selectedDate
                        }
                        setSelectedDate={
                            setSelectedDate
                        }
                        filteredTasks={
                            filteredTasks
                        }
                    />
                }
                ListEmptyComponent={
                    EmptyComponent
                }
            />

            {/* ========================================================
                EDIT TASK MODAL
            ======================================================== */}

            <Modal
                visible={
                    !!editingTask
                }
                transparent
                animationType="slide"
                onRequestClose={() =>
                    setEditingTask(
                        null
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
                            styles.editModal,
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
                                    Edit Task
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
                                    Update task
                                    details
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
                                    setEditingTask(
                                        null
                                    )
                                }
                            >
                                <Ionicons
                                    name="close"
                                    size={22}
                                    color={
                                        theme.text
                                    }
                                />
                            </TouchableOpacity>
                        </View>

                        {/* NAME */}
                        <Text
                            style={[
                                styles.modalLabel,
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
                                styles.modalInput,
                                {
                                    backgroundColor:
                                        theme.input,
                                    borderColor:
                                        theme.border,
                                    color:
                                        theme.text,
                                },
                            ]}
                            value={
                                editedName
                            }
                            onChangeText={
                                setEditedName
                            }
                            placeholder="Task name"
                            placeholderTextColor={
                                theme.muted
                            }
                        />

                        {/* DESCRIPTION */}
                        <Text
                            style={[
                                styles.modalLabel,
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
                                styles.modalInput,
                                styles.descriptionEdit,
                                {
                                    backgroundColor:
                                        theme.input,
                                    borderColor:
                                        theme.border,
                                    color:
                                        theme.text,
                                },
                            ]}
                            value={
                                editedDescription
                            }
                            onChangeText={
                                setEditedDescription
                            }
                            placeholder="Add a description..."
                            placeholderTextColor={
                                theme.muted
                            }
                            multiline
                            textAlignVertical="top"
                        />

                        {/* DATE */}
                        <Text
                            style={[
                                styles.modalLabel,
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
                                styles.modalDateButton,
                                {
                                    backgroundColor:
                                        theme.input,
                                    borderColor:
                                        theme.border,
                                },
                            ]}
                            onPress={() =>
                                setShowEditCalendar(
                                    true
                                )
                            }
                        >
                            <Ionicons
                                name="calendar-outline"
                                size={20}
                                color={
                                    theme.primary
                                }
                            />

                            <Text
                                style={[
                                    styles.modalDateText,
                                    {
                                        color:
                                            theme.text,
                                    },
                                ]}
                            >
                                {formatDate(
                                    editedDate
                                )}
                            </Text>

                            <Ionicons
                                name="chevron-forward"
                                size={18}
                                color={
                                    theme.muted
                                }
                            />
                        </TouchableOpacity>

                        {/* CATEGORY */}
                        <Text
                            style={[
                                styles.modalLabel,
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
                                styles.editCategoryGrid
                            }
                        >
                            {CATEGORIES.map(
                                (
                                    category
                                ) => {
                                    const isSelected =
                                        editedCategory.name ===
                                        category.name;

                                    return (
                                        <TouchableOpacity
                                            key={
                                                category.name
                                            }
                                            style={[
                                                styles.editCategory,
                                                {
                                                    backgroundColor:
                                                        isSelected
                                                            ? `${category.color}18`
                                                            : theme.input,

                                                    borderColor:
                                                        isSelected
                                                            ? category.color
                                                            : theme.border,
                                                },
                                            ]}
                                            onPress={() =>
                                                setEditedCategory(
                                                    category
                                                )
                                            }
                                        >
                                            <View
                                                style={[
                                                    styles.categoryDotLarge,
                                                    {
                                                        backgroundColor:
                                                            category.color,
                                                    },
                                                ]}
                                            />

                                            <Text
                                                style={[
                                                    styles.editCategoryText,
                                                    {
                                                        color:
                                                            theme.text,
                                                    },
                                                ]}
                                            >
                                                {
                                                    category.name
                                                }
                                            </Text>

                                            {isSelected && (
                                                <Ionicons
                                                    name="checkmark-circle"
                                                    size={
                                                        18
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

                        {/* SAVE */}
                        <TouchableOpacity
                            style={[
                                styles.saveButton,
                                {
                                    backgroundColor:
                                        theme.primary,
                                },
                            ]}
                            onPress={
                                handleSaveEdit
                            }
                        >
                            <Ionicons
                                name="checkmark"
                                size={20}
                                color="#FFFFFF"
                            />

                            <Text
                                style={
                                    styles.saveButtonText
                                }
                            >
                                Save Changes
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* ========================================================
                EDIT DATE CALENDAR MODAL
            ======================================================== */}

            <Modal
                visible={
                    showEditCalendar
                }
                transparent
                animationType="slide"
                onRequestClose={() =>
                    setShowEditCalendar(
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
                            styles.dateModal,
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
                                    Select Due
                                    Date
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
                                    Choose a new
                                    date
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
                                    setShowEditCalendar(
                                        false
                                    )
                                }
                            >
                                <Ionicons
                                    name="close"
                                    size={22}
                                    color={
                                        theme.text
                                    }
                                />
                            </TouchableOpacity>
                        </View>

                        <View
                            style={
                                styles.calendarCardInside
                            }
                        >
                            <Calendar
                                markedDates={{
                                    [dateToString(
                                        editedDate
                                    )]: {
                                        selected: true,
                                        selectedColor:
                                            theme.primaryLight,
                                        selectedTextColor:
                                            theme.primary,
                                    },
                                }}
                                onDayPress={(
                                    day
                                ) => {
                                    setEditedDate(
                                        dateStringToDate(
                                            day.dateString
                                        )
                                    );

                                    setShowEditCalendar(
                                        false
                                    );
                                }}
                                enableSwipeMonths
                                firstDay={1}
                                hideExtraDays
                                theme={{
                                    backgroundColor:
                                        theme.card,
                                    calendarBackground:
                                        theme.card,
                                    textSectionTitleColor:
                                        theme.muted,
                                    textSectionTitleDisabledColor:
                                        theme.muted,
                                    selectedDayBackgroundColor:
                                        theme.primaryLight,
                                    selectedDayTextColor:
                                        theme.primary,
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
                                    disabledArrowColor:
                                        theme.muted,
                                    textDayFontSize: 14,
                                    textMonthFontSize: 17,
                                    textDayHeaderFontSize: 11,
                                }}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

// ============================================================
// STYLES
// ============================================================

const styles =
    StyleSheet.create({
        screen: {
            flex: 1,
        },

        listContent: {
            padding: 20,
            paddingBottom: 45,
        },

        header: {
            flexDirection:
                'row',
            justifyContent:
                'space-between',
            alignItems:
                'center',
            marginBottom: 18,
        },

        headerTextWrap: {
            flex: 1,
            paddingRight: 8,
        },

        title: {
            fontSize: 29,
            fontWeight:
                '800',
        },

        subtitle: {
            fontSize: 14,
            marginTop: 4,
        },

        headerActions: {
            flexDirection:
                'row',
            gap: 8,
        },

        iconButton: {
            width: 44,
            height: 44,
            borderRadius: 14,
            justifyContent:
                'center',
            alignItems:
                'center',
            elevation: 2,
        },

        addHeaderButton: {
            width: 44,
            height: 44,
            borderRadius: 14,
            justifyContent:
                'center',
            alignItems:
                'center',
            elevation: 4,
        },

        searchContainer: {
            flexDirection:
                'row',
            alignItems:
                'center',
            borderWidth: 1,
            borderRadius: 14,
            paddingHorizontal: 14,
            height: 48,
            marginBottom: 12,
        },

        searchInput: {
            flex: 1,
            minWidth: 0,
            marginLeft: 8,
            fontSize: 15,
        },

        filterContainer: {
            gap: 8,
            paddingBottom: 15,
        },

        filterChip: {
            height: 38,
            borderRadius: 19,
            paddingHorizontal: 13,
            borderWidth: 1,
            flexDirection:
                'row',
            alignItems:
                'center',
            gap: 6,
        },

        filterDot: {
            width: 7,
            height: 7,
            borderRadius: 4,
        },

        filterText: {
            fontSize: 12,
            fontWeight:
                '700',
        },

        calendarToggle: {
            flexDirection:
                'row',
            alignItems:
                'center',
            justifyContent:
                'center',
            borderWidth: 1,
            borderRadius: 14,
            height: 48,
            marginBottom: 16,
            gap: 8,
        },

        calendarToggleText: {
            fontSize: 15,
            fontWeight:
                '600',
        },

        calendarCard: {
            borderRadius: 24,
            padding: 8,
            overflow:
                'hidden',
            elevation: 3,
        },

        calendar: {
            borderRadius: 18,
        },

        selectedHeader: {
            marginTop: 23,
            marginBottom: 13,
            flexDirection:
                'row',
            alignItems:
                'center',
            justifyContent:
                'space-between',
        },

        selectedLabel: {
            fontSize: 10,
            fontWeight:
                '800',
            letterSpacing:
                1.1,
        },

        selectedDate: {
            fontSize: 18,
            fontWeight:
                '800',
            marginTop: 4,
        },

        countBubble: {
            width: 42,
            height: 42,
            borderRadius: 14,
            alignItems:
                'center',
            justifyContent:
                'center',
        },

        countText: {
            fontSize: 16,
            fontWeight:
                '800',
        },

        taskCard: {
            borderRadius: 18,
            marginBottom: 12,
            flexDirection:
                'row',
            overflow:
                'hidden',
            elevation: 2,
        },

        colorBar: {
            width: 5,
        },

        taskContent: {
            flex: 1,
            padding: 15,
        },

        taskTop: {
            flexDirection:
                'row',
            alignItems:
                'flex-start',
        },

        taskTitleContainer: {
            flex: 1,
            paddingRight: 8,
        },

        taskName: {
            fontSize: 16,
            fontWeight:
                '800',
        },

        actionButtons: {
            flexDirection:
                'row',
            gap: 7,
        },

        actionButton: {
            width: 35,
            height: 35,
            borderRadius: 10,
            justifyContent:
                'center',
            alignItems:
                'center',
        },

        taskDescription: {
            fontSize: 13,
            lineHeight: 19,
            marginTop: 7,
        },

        taskDateHint: {
            fontSize: 11,
            marginTop: 8,
            fontWeight:
                '600',
        },

        categoryBadge: {
            flexDirection:
                'row',
            alignItems:
                'center',
            alignSelf:
                'flex-start',
            borderRadius: 20,
            paddingHorizontal: 9,
            paddingVertical: 6,
            marginTop: 10,
        },

        categoryDot: {
            width: 7,
            height: 7,
            borderRadius: 4,
            marginRight: 6,
        },

        categoryText: {
            fontSize: 11,
            fontWeight:
                '700',
        },

        emptyCard: {
            borderRadius: 22,
            padding: 28,
            alignItems:
                'center',
            marginTop: 3,
        },

        emptyIcon: {
            width: 58,
            height: 58,
            borderRadius: 18,
            justifyContent:
                'center',
            alignItems:
                'center',
            marginBottom: 14,
        },

        emptyTitle: {
            fontSize: 18,
            fontWeight:
                '800',
        },

        emptyText: {
            fontSize: 13,
            textAlign:
                'center',
            lineHeight: 19,
            marginTop: 6,
            marginBottom: 18,
        },

        emptyButton: {
            height: 46,
            paddingHorizontal: 18,
            borderRadius: 14,
            flexDirection:
                'row',
            alignItems:
                'center',
            gap: 7,
        },

        emptyButtonText: {
            color: 'white',
            fontSize: 14,
            fontWeight:
                '800',
        },

        modalOverlay: {
            flex: 1,
            justifyContent:
                'flex-end',
            backgroundColor:
                'rgba(0,0,0,0.55)',
        },

        editModal: {
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            padding: 20,
            paddingBottom: 30,
        },

        dateModal: {
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            padding: 20,
            paddingBottom: 30,
        },

        modalHeader: {
            flexDirection:
                'row',
            justifyContent:
                'space-between',
            alignItems:
                'center',
            marginBottom: 17,
        },

        modalTitle: {
            fontSize: 22,
            fontWeight:
                '800',
        },

        modalSubtitle: {
            fontSize: 12,
            marginTop: 3,
        },

        closeButton: {
            width: 40,
            height: 40,
            borderRadius: 13,
            justifyContent:
                'center',
            alignItems:
                'center',
        },

        modalLabel: {
            fontSize: 10,
            fontWeight:
                '800',
            letterSpacing: 1,
            marginTop: 4,
            marginBottom: 8,
        },

        modalInput: {
            minHeight: 49,
            borderWidth: 1,
            borderRadius: 14,
            paddingHorizontal: 14,
            fontSize: 15,
            marginBottom: 13,
        },

        descriptionEdit: {
            height: 80,
            paddingTop: 12,
            textAlignVertical:
                'top',
        },

        modalDateButton: {
            height: 50,
            borderWidth: 1,
            borderRadius: 14,
            flexDirection:
                'row',
            alignItems:
                'center',
            paddingHorizontal: 13,
            marginBottom: 14,
        },

        modalDateText: {
            flex: 1,
            marginLeft: 10,
            fontSize: 14,
            fontWeight:
                '700',
        },

        editCategoryGrid: {
            flexDirection:
                'row',
            flexWrap:
                'wrap',
            gap: 8,
            marginBottom: 16,
        },

        editCategory: {
            width: '48%',
            minHeight: 43,
            borderWidth: 1,
            borderRadius: 13,
            flexDirection:
                'row',
            alignItems:
                'center',
            paddingHorizontal: 9,
        },

        categoryDotLarge: {
            width: 10,
            height: 10,
            borderRadius: 5,
            marginRight: 8,
        },

        editCategoryText: {
            flex: 1,
            fontSize: 11,
            fontWeight:
                '700',
        },

        saveButton: {
            height: 53,
            borderRadius: 16,
            flexDirection:
                'row',
            alignItems:
                'center',
            justifyContent:
                'center',
            gap: 8,
        },

        saveButtonText: {
            color: 'white',
            fontSize: 15,
            fontWeight:
                '800',
        },

        calendarCardInside: {
            borderRadius: 18,
            overflow:
                'hidden',
        },
    });

export default TaskListScreen;