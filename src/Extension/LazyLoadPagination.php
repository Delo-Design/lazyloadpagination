<?php namespace Joomla\Plugin\System\LazyLoadPagination\Extension;

\defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\Plugin\CMSPlugin;

class LazyLoadPagination extends CMSPlugin
{

	protected $app;

	public function onBeforeRender()
	{

		if ($this->app->isClient('administrator'))
		{
			return;
		}

		$menu = $this->app->getMenu()->getActive();

		if (!isset($menu->id))
		{
			return;
		}

		$configs       = $this->params->get('targets', null);
		$config_target = [];

		if (is_null($configs))
		{
			return;
		}

		foreach ($configs as $config)
		{
			$ids = explode(',', $config->itemsmenu);

			if (in_array((string) $menu->id, $ids))
			{
				$config_target = $config;
				break;
			}

		}

		if (empty($config_target))
		{
			return;
		}

		$wa = Factory::getApplication()->getDocument()->getWebAssetManager();

		$wa->addInlineScript(<<<EOF
window.LazyLoadPaginationConfig = {
	target_pagination: '{$config_target->target_pagination}',
	target_li: '{$config_target->target_li}',
	target_active: '{$config_target->target_active}',
	target_content: '{$config_target->target_content}'
};
EOF
		);

		$assetsRegistry = $wa->getRegistry();
		$assetsRegistry->addExtensionRegistryFile('plg_system_lazyloadpagination');
		$wa->useScript('plg_system_lazyloadpagination.lazyloadpagination');
	}

}