# FinancialManagement_Mobile

A Mobile version of the FinancialManagementUI, made from scratch to ease on the learning process of react native basis. Application that allows personal financial management. This mobile app was developed in order be able to save information offline and from anywhere.

<!-- Version History -->

### VERSION HISTORY

- 1.0.0

  - Initial Version with basic UI elements

- 2.0.0

  - UI Refresher with more standardized components

- 3.0.0
  - Migrated app context storage with asyncLocalStorage to typeOrm sqlite db storage
  - Subscription feature to have recurring expenses
  - Custom calendar componenent
  - Calendar scroll fix
  - Refactoring trade page
- 3.0.9
  - FlatOptionItem to allow trade edit
- 3.1.0
  - Trade element edit and delete feature
  - Security element delete feature
  - Custom notification box to use across app with event emitter
  - Home bug fix expense not showing
  - Purchase name suggestion feature
  - List item with swipeable feature
- 3.2.0
  - Major expo SDK 53 update and compatible dependency
- 3.2.1
  - Fixed bounceIn on modal component
  - Fixed typeorm not showing decimals after version update
  - Updated db backup service
  - Polish on list item swipeable layout
  - Fixed calendar card component now showing after update
  - Polish on currency symbol
  - Fixing list calendar size
- 3.2.2
  - Added subscription total amount information
  - Minor polish on subscription day icon
- 3.3.3
  - Fixed bug where purchase refunded transaction could not be deleted
  - Fixed split user registry UI
- 3.4.0
  - Polish on home page
  - Added percentage of expense type
  - Added total expense on list
- 3.5.0
  - Generic bar chart card component
  - Added stats on expense and savings bar charts
  - Minor polish on custom bar chart
- 3.6.0
  - Polished Networth and Networth UI components
  - Use of glass background on most components for uniform look
  - Polish icons, icon size and badge
  - Polish on TypeIcon component to remove border color
  - Improve expense info component to generic ExpenseItem
  - Polish add forms on purchase, transaction and income
  - Polished FlatCalendar component to be more consistent
  - Custom button default text change to save
- 3.7.0
  - Allow subscription to be edited on amount and day of month
  - Dual Text Input with optional label
  - Delete subscription feature
- 3.8.0
  - Standardize common padding
  - Add initial blur options and sensitive values
  - Networth Statistics bug fix when only one datapoint exists
- 3.9.0
  - Fixed bug where insert trade was not working
  - Allow trade share amount to use decimal values and db update
  - Improved trade filter to have information such as total invested
  - Minor polish on trade page to align list
- 3.10.0
  - Update typoOrm date between query update
- 3.11.0
  - Dependency Updates
  - Library query update
  - Fixed subscription logic due to date
