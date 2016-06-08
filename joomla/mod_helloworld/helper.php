<?php
/**
 * Helper class for Hello World! module
 *
 * @package    Chrisland.Uni
 * @subpackage Modules
 * @license        GNU/GPL, see LICENSE.php
 */

class ModHelloWorldHelper
{
    /**
     * Retrieves the hello message
     *
     * @param   array  $params An object containing the module parameters
     *
     * @access public
     */

    public static function getHello($params)
    {
        return 'Hello, World!';
    }

}
