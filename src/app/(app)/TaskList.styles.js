import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },

    listContent: {
        padding: 20,
        paddingBottom: 45,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 18,
    },

    title: {
        fontSize: 29,
        fontWeight: '800',
    },

    subtitle: {
        fontSize: 14,
        marginTop: 4,
    },

    headerActions: {
        flexDirection: 'row',
        gap: 8,
    },

    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
    },

    addHeaderButton: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
    },

    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
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
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },

    filterDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
    },

    filterText: {
        fontSize: 12,
        fontWeight: '700',
    },

    calendarToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 14,
        height: 48,
        marginBottom: 16,
        gap: 8,
    },

    calendarToggleText: {
        fontSize: 15,
        fontWeight: '600',
    },

    calendarCard: {
        borderRadius: 24,
        padding: 8,
        overflow: 'hidden',
        elevation: 3,
    },

    calendar: {
        borderRadius: 18,
    },

    selectedHeader: {
        marginTop: 23,
        marginBottom: 13,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    selectedLabel: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1.1,
    },

    selectedDate: {
        fontSize: 18,
        fontWeight: '800',
        marginTop: 4,
    },

    countBubble: {
        width: 42,
        height: 42,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },

    countText: {
        fontSize: 16,
        fontWeight: '800',
    },

    taskCard: {
        borderRadius: 18,
        marginBottom: 12,
        flexDirection: 'row',
        overflow: 'hidden',
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
        flexDirection: 'row',
        alignItems: 'flex-start',
    },

    taskTitleContainer: {
        flex: 1,
        paddingRight: 8,
    },

    taskName: {
        fontSize: 16,
        fontWeight: '800',
    },

    actionButtons: {
        flexDirection: 'row',
        gap: 7,
    },

    actionButton: {
        width: 35,
        height: 35,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },

    taskDescription: {
        fontSize: 13,
        lineHeight: 19,
        marginTop: 7,
    },

    taskDateHint: {
        fontSize: 11,
        marginTop: 8,
        fontWeight: '600',
    },

    categoryBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
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
        fontWeight: '700',
    },

    emptyCard: {
        borderRadius: 22,
        padding: 28,
        alignItems: 'center',
        marginTop: 3,
    },

    emptyIcon: {
        width: 58,
        height: 58,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 14,
    },

    emptyTitle: {
        fontSize: 18,
        fontWeight: '800',
    },

    emptyText: {
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 19,
        marginTop: 6,
        marginBottom: 18,
    },

    emptyButton: {
        height: 46,
        paddingHorizontal: 18,
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
    },

    emptyButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '800',
    },

    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.55)',
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 17,
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

    modalLabel: {
        fontSize: 10,
        fontWeight: '800',
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
        textAlignVertical: 'top',
    },

    modalDateButton: {
        height: 50,
        borderWidth: 1,
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 13,
        marginBottom: 14,
    },

    modalDateText: {
        flex: 1,
        marginLeft: 10,
        fontSize: 14,
        fontWeight: '700',
    },

    editCategoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 16,
    },

    editCategory: {
        width: '48%',
        minHeight: 43,
        borderWidth: 1,
        borderRadius: 13,
        flexDirection: 'row',
        alignItems: 'center',
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
        fontWeight: '700',
    },

    saveButton: {
        height: 53,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },

    saveButtonText: {
        color: 'white',
        fontSize: 15,
        fontWeight: '800',
    },

    calendarCardInside: {
        borderRadius: 18,
        overflow: 'hidden',
    },
});

export default styles;